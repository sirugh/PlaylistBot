import path from 'path'

import * as Reddit from './reddit.mjs'
import * as Spotify from './spotify.mjs'
import { delay, require } from './util/index.mjs'

const config = require(path.resolve('config.json'))
const secrets = require(path.resolve('secrets.json'))

const run = async () => {
    // Initialize an authorized spotifyApi instance.
    const spotifyApi = await Spotify.init(secrets.spotify)
    const token = spotifyApi.getAccessToken()
    const redditApi = Reddit.logIn(secrets.reddit)

    if (!token) {
        console.log('Unable to authorize, exiting.')
        return
    }

    // TODO: Make this a for loop. Can't use async like this, it'll just start all the spotify searches at the same time.
    config.playlists.forEach(async playlist => {
        console.log(`Searching Reddit thread ${playlist.reddit_thread_id}...`)
        // TODO: figure out how to limit this query
        const comments = await redditApi
            .getSubmission(playlist.reddit_thread_id)
            .comments // TODO: Figure out why this returns a 403.
            // .setSuggestedSort('top')
            .filter(comment => {
                // dont use deleted or removed comments
                const filterTerms = ['[removed]', '[deleted]']
                return !filterTerms.includes(comment.body)
            })
            .sort((a, b) => b.ups - a.ups)

        console.log(
            `Found ${comments.length} Reddit comments (after filtering).`
        )

        console.log('Searching Spotify for songs...')
        // For each comment, search and then pause 100ms before resolving to
        // give the API some time to breathe.
        const results = []
        for (let index = 0; index < comments.length; index++) {
            const comment = comments[index]
            const result = await Spotify.search(spotifyApi, comment.body)
            await delay(100)
            results.push(result)
        }

        const filteredResults = results.filter(x => x)
        console.log(`Found ${filteredResults.length} songs on Spotify.`)

        if (!filteredResults.length) return

        console.log(`Replacing songs on playlist...`)
        try {
            await spotifyApi.replaceTracksInPlaylist(
                playlist.playlist_id,
                filteredResults.map(result => result.uri)
            )
        } catch (err) {
            console.error('Unable to add tracks to playlist.')
        }
    })
}

run()
