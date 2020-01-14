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
    //TODO Why does Fuck you - Ceelo Green not return a result?
    // Split on hyphen, or "by" if possible.
    let [songNameGuess, artistNameGuess] = searchString.split('-')
    if (!songNameGuess) {
        let [songNameGuess, artistNameGuess] = searchString.split('by')
    }

    if (!songNameGuess) return

    const filterString = ['karaoke', 'made famous by', 'performed by', 'originally by']
        .map(text => `"${text}"`)
        .join(' NOT ')

    // Sometimes comments can be pretty long. Search by the first 40 characters,
    // which should be longer than most song titles and exclude some common
    // strings that produce covers.
    const query = `${songNameGuess.substring(0, 40)} NOT ${filterString}`
    // console.log(`Searching for "${query}...".`)

    try {
        const { body } = await api.search(query, ['track'], {})

        if (!body.tracks.items.length) {
            return
        }

        return {
            query,
            id: body.tracks.items[0].id,
            title: body.tracks.items[0].name,
            artist: body.tracks.items[0].artists[0].name,
            url: body.tracks.items[0].external_urls.spotify,
            uri: body.tracks.items[0].uri
        }
    } catch (err) {
        // Noisy as this could happen for _every_ matched song.
        console.error(err)
    }
}

export { init, search }
