import path from 'path';

import * as Reddit from './reddit.mjs';
import * as Spotify from './spotify.mjs';
import { require } from './util.mjs';

const config = require(path.resolve("config.json"));
const secrets = require(path.resolve("secrets.json"));

const REDDIT_THREAD_ID = config.playlists[0].reddit_thread_id

const run = async () => {
    const spotifyToken = await Spotify.logIn(secrets.spotify);
    const authedReddit = Reddit.logIn(secrets.reddit);
    // TODO: figure out how to limit this query
    const comments = await authedReddit
        .getSubmission(REDDIT_THREAD_ID)
        // .setSuggestedSort('top') // TODO: Figure out why this returns a 403.
        .comments
        .filter(comment => comment.ups > 1000) // only use comments with > 1000 upvotes
        .filter(comment => comment.body != "[removed]") // dont use deleted comments
        .sort((a, b) => b.ups - a.ups)

    console.log(`Found ${comments.length} reddit comments with 1000 upvotes`)

    Promise.all(
        comments
            .map(async comment => {
                const results = await Spotify.search(spotifyToken, comment.body)
                return results;
            })

    ).then(async results => {
        const filteredResults = results.filter(x => x)
        // Log all found results
        console.log(`Found ${filteredResults.length} songs on Spotify.`)
        console.log(filteredResults)
        // await Spotify.setPlaylistTracks(spotifyToken, filteredResults.map(result => result.uri))
    })
}

run()