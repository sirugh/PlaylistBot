import request from 'request';


// Auth with Spotify
const logIn = async ({ clientId, clientSecret }) => {
    const ENDPOINT = 'https://accounts.spotify.com/api/token';
    const POST_QUERY = 'grant_type=client_credentials';
    let buf = Buffer.from(`${clientId}:${clientSecret}`);
    let encodedData = buf.toString('base64');

    const getToken = async () => {
        return new Promise((resolve, reject) => request({
            url: ENDPOINT,
            method: "POST",
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

const search = async (token, searchString) => {
    const ENDPOINT = 'https://api.spotify.com/v1/search?limit=1&type=track&query='
    const urlSearchString = searchString.split(' ').join('+')
    const url = `${ENDPOINT}${urlSearchString}`

    const search = async () => {
        return new Promise((resolve, reject) => request({
            url,
            method: "GET",
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
            name: response.tracks.items[0].name,
            url: response.tracks.items[0].external_urls.spotify
        }
        return result;
    }
    catch (err) {
        // console.error(err)
    }
}

export {
    logIn,
    search
}