# PlaylistBot

## Hi

I scanned [a Reddit thread](https://www.reddit.com/r/AskReddit/comments/embv3x/what_90s_song_will_always_be_a_banger) for top comments and created a [Spotify playlist](https://open.spotify.com/playlist/7dj7mA1bjzI0N1WZoBvh9j) out of them.

## How To

1) Create a `secrets.json` file in the root.

```json
{
  "reddit": {
    "userAgent": "Your user agent string",
    "clientId": "Your Reddit client id",
    "clientSecret": "Your Reddit client secret",
    "username": "Your Reddit username",
    "password": "Your Reddit password",
  },
  "spotify": {
    "clientId": "Your Spotify client id",
    "clientSecret": "Your Spotify client secret",
    "code": "Your auth code from an interactive Spotify user authorization"
  }
}
```

2) Install dependencies with `yarn`.

3) Run it with `yarn start`.

```bash
$ yarn start
yarn run v1.21.1
$ node --experimental-modules src/index.mjs
(node:7224) ExperimentalWarning: The ESM module loader is experimental.
Found 48 Reddit comments with at least 1000 upvotes.
Found 18 songs on Spotify.
Replacing songs on playlist...
Done in 3.70s.
```

4) Notice interesting results. This is because:

* I do not do any modifications to the search string _besides_ including the specific "NOT karaoke" which.
* Spotify search returns covers/remixes as the first result sometimes -- For example, `Basket Case by Green Day` returns a cover while `query=Basket Case` returns the original.
