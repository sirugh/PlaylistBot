import path from 'path';

import request from 'request';
import { require } from './util.mjs';

const config = require(path.resolve("config.json"));

// Auth with Spotify
const logIn = async ({ clientId, clientSecret }) => {
    const ENDPOINT = 'https://accounts.spotify.com/api/token';
    const POST_QUERY = 'grant_type=client_credentials';
    let buf = Buffer.from(`${clientId}:${clientSecret}`);
    let encodedData = buf.toString('base64');

    const getToken = async () => {
        return new Promise((resolve, reject) => request.post({
            url: ENDPOINT,
            headers: {
                'Authorization': `Basic ${encodedData}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': POST_QUERY.length
            },
            body: POST_QUERY
        }, function (error, response, data) {
            if (error) {
                reject(error)
            }

            resolve(JSON.parse(data))
        }))
    };

    const response = await getToken();
    return response.access_token;
}

const PLAYLIST_ID = config.playlists[0].playlist_id;

/**
 * Update a playlist with a list of uris.
 * TODO: Get User Auth working and then this may work.
 *       See https://www.npmjs.com/package/spotify-web-api-node
 * 
 * @param token auth token
 * @param uris array of spotify uri like "spotify:track:4owyLbzoUvDT5Cliz3u5rh"
 */
const setPlaylistTracks = async (token, uris) => {
    console.log(`Setting ${PLAYLIST_ID} with ${uris.length} tracks using token ${token}`);
    const ENDPOINT = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`
    const update = async () => {
        return new Promise((resolve, reject) => request.put({
            url: ENDPOINT,
            method: "PUT",
            headers: {
                'Authorization': `Bearer  ${token}`,
                'Content-Type': 'application/json'
            },
            json: {
                "range_start": 1,
                "range_length": 2,
                "insert_before": 3,
                uris: JSON.stringify(uris)
            }
        }, function (error, response, data) {
            if (error) {
                reject(error)
            }

            if (data) {
                let res;
                try {
                    res = JSON.parse(data)
                }
                catch (e) {
                    console.error(data)
                }
                resolve(res)
            }
            else {
            }
        }))
    };

    try {
        const response = await update();

        return;
    }
    catch (err) {
        console.error(err)
    }
}

const search = async (token, searchString) => {
    const ENDPOINT = 'https://api.spotify.com/v1/search?limit=1&type=track&query='
    const urlSearchString = searchString.split(' ').join('+')
    const filter = '+NOT+karaoke';
    const url = `${ENDPOINT}${urlSearchString}${filter}`

    const search = async () => {
        return new Promise((resolve, reject) => request.get({
            url,
            headers: {
                'Authorization': `Bearer  ${token}`
            }
        }, function (error, response, data) {
            if (error) {
                reject(error)
            }

            if (data) {
                resolve(JSON.parse(data))
            }
            else {
                // TODO: Figure out why some responses are empty
            }
        }))
    };

    try {
        const response = await search();

        const result = {
            searchString,
            searchUrl: url,
            id: response.tracks.items[0].id,
            title: response.tracks.items[0].name,
            artist: response.tracks.items[0].artists[0].name,
            url: response.tracks.items[0].external_urls.spotify,
            uri: response.tracks.items[0].uri
        }
        return result;
    }
    catch (err) {
        // console.error(err)
    }
}

export {
    logIn,
    search,
    setPlaylistTracks
}
