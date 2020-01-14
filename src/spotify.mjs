import path from 'path'
import SpotifyWebApi from 'spotify-web-api-node'

import request from 'request'
import { require } from './util/index.mjs'

const config = require(path.resolve('config.json'))

/**
 * Initialize the spotify API. 
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {string} code The code returned from a Spotify /authorize request.
 */
const init = async ({ clientId, clientSecret, code }) => {
    console.log('Authorizing with Spotify...')
    const spotifyApi = new SpotifyWebApi({
        clientId,
        clientSecret,
        redirectUri: 'http://localhost/callback'
    })

    await spotifyApi.authorizationCodeGrant(code).then(
        data => {
            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token'])
            spotifyApi.setRefreshToken(data.body['refresh_token'])
        },
        err => {
            console.log('Something went wrong!', err)
        }
    )

    return spotifyApi
}

const search = async (api, searchString) => {
    const query = `${searchString} NOT karaoke`
    // Sometimes comments can be pretty long...
    // console.log(`Searching for "${searchString.substring(0, 20)}...".`)
    try {
        const { body } = await api.search(query, ['track'], {})

        if (!body.tracks.items.length) {
            return;
        }

        return {
            searchString,
            id: body.tracks.items[0].id,
            title: body.tracks.items[0].name,
            artist: body.tracks.items[0].artists[0].name,
            url: body.tracks.items[0].external_urls.spotify,
            uri: body.tracks.items[0].uri
        }
    } catch (err) {
        console.error(err)
    }
}

export { init, search }
