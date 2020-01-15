import path from 'path';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import snoowrap from 'snoowrap';

import { delay, requireJSON } from './util.mjs';

const config = requireJSON(path.resolve('config.json'));
const secrets = requireJSON(path.resolve('secrets.json'));

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
    clientId: secrets.spotify.clientId,
    clientSecret: secrets.spotify.clientSecret,
    redirectUri: secrets.spotify.redirectUri
});

const redditApi = new snoowrap({
    ...secrets.reddit
});

app.get('/', (req, res) => {
    // If we are alread authed then proceed directly to go.
    if (spotifyApi.getAccessToken()) {
        res.redirect('/go');
    } else {
        // Otherwise start the auth process.
        const authorizeUrl = spotifyApi.createAuthorizeURL([
            'user-read-private',
            'playlist-modify-public'
        ]);
        res.redirect(authorizeUrl);
    }
});

app.get('/spotify_auth', async (req, res) => {
    await spotifyApi.authorizationCodeGrant(req.query.code).then(
        data => {
            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
            res.redirect('/go');
        },
        err => {
            console.error(err);
            res.send('Something went wrong!');
        }
    );
});

app.get('/go', async (req, res) => {
    for (let i = 0; i < config.playlists.length; i++) {
        const { reddit_thread_id, playlist_id } = config.playlists[i];

        console.log(`Searching Reddit thread ${reddit_thread_id}...`);
        // TODO: figure out how to limit this query
        let comments = await redditApi
            .getSubmission(reddit_thread_id)
            .comments;
        // TODO: Figure out why this returns a 403.
        // .setSuggestedSort('top')

        comments = comments
            .map(comment => comment.body.trim())
            // dont use deleted or removed comments    
            .filter(comment => {
                const filterTerms = ['[removed]', '[deleted]'];
                return !filterTerms.includes(comment.body);
            })
            // dedupe
            .filter((comment, index) => comments.indexOf(comment) === index)
            .sort((a, b) => b.ups - a.ups);

        console.log(
            `Found ${comments.length} Reddit comments (after filtering).`
        );

        console.log('Searching Spotify for songs...');

        // For each comment, search and then pause 100ms before resolving to
        // give the API some time to breathe.
        const results = [];
        for (let index = 0; index < comments.length; index++) {
            const comment = comments[index];
            const result = await searchSpotify(comment);
            await delay(100);
            results.push(result);
        }

        const filteredResults = results.filter(x => x);
        console.log(`Found ${filteredResults.length} songs on Spotify.`);

        if (!filteredResults.length) return;

        console.log('Replacing songs on playlist...');
        try {
            await spotifyApi.replaceTracksInPlaylist(
                playlist_id,
                filteredResults.map(result => result.uri)
            );
            console.log('Done!');
        } catch (err) {
            console.error('Unable to add tracks to playlist.');
        }
    }
    res.redirect('/done');
});

app.get('/done', (req, res) => { res.send('Done!'); });
app.listen(port, () => console.log(`Bot listening on port ${port}!`));

const searchSpotify = async searchString => {
    //TODO Why does Fuck you - Ceelo Green not return a result?
    // Split on hyphen, or "by" if possible.
    let [songNameGuess] = searchString.split('-');
    if (!songNameGuess) {
        [songNameGuess] = searchString.split('by');
    }

    if (!songNameGuess) return;

    const filterString = [
        'karaoke',
        'made famous by',
        'performed by',
        'originally by'
    ]
        .map(text => `"${text}"`)
        .join(' NOT ');

    // Sometimes comments can be pretty long. Search by the first 40 characters,
    // which should be longer than most song titles and exclude some common
    // strings that produce covers.
    const query = `${songNameGuess.substring(0, 40)} NOT ${filterString}`;

    try {
        const { body } = await spotifyApi.search(query, ['track'], {});

        if (!body.tracks.items.length) {
            return;
        }

        const result = {
            query,
            title: body.tracks.items[0].name,
            artist: body.tracks.items[0].artists[0].name,
            url: body.tracks.items[0].external_urls.spotify,
            uri: body.tracks.items[0].uri
        };

        // console.log(`QUERY: ${songNameGuess}`);
        // console.log(`RESULT: ${result.title} - ${result.artist}`);

        return result;
    } catch (err) {
        // Noisy as this could happen for _every_ matched song.
        console.error(err);
    }
};
