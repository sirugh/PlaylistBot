import path from 'path'

import * as Reddit from './reddit.mjs'
import * as Spotify from './spotify.mjs'
import { require } from './util/index.mjs'

const config = require(path.resolve('config.json'))
const secrets = require(path.resolve('secrets.json'))

const REDDIT_THREAD_ID = config.playlists[0].reddit_thread_id
const PLAYLIST_ID = config.playlists[0].playlist_id

const run = async () => {
    // Initialize an authorized spotifyApi instance.
    const spotifyApi = await Spotify.init(secrets.spotify)
    const token = spotifyApi.getAccessToken()
    if (!token) {
        console.log('Unable to authorize, exiting.');
        return;
    }

    const redditApi = Reddit.logIn(secrets.reddit)
    // TODO: figure out how to limit this query
    const comments = await redditApi
        .getSubmission(REDDIT_THREAD_ID)
        // .setSuggestedSort('top') // TODO: Figure out why this returns a 403.
        .comments.filter(comment => comment.ups > 1000) // only use comments with > 1000 upvotes
        .filter(comment => comment.body != '[removed]') // dont use deleted comments
        .sort((a, b) => b.ups - a.ups)

    console.log(
        `Found ${comments.length} Reddit comments with at least 1000 upvotes.`
    )

    Promise.all(
        comments.map(async comment => {
            return await Spotify.search(spotifyApi, comment.body)
        })
    ).then(async results => {
        const filteredResults = results.filter(x => x)
        console.log(`Found ${filteredResults.length} songs on Spotify.`)

        if (!filteredResults.length) return;

        console.log(`Replacing songs on playlist...`)
        try {
            await spotifyApi.replaceTracksInPlaylist(
                PLAYLIST_ID,
                filteredResults.map(result => result.uri)
            )
        }
        catch (err) {
            console.error('Unable to add tracks to playlist.')
        }
    })
}

run()
