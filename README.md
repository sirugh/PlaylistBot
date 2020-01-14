# PlaylistBot

I make/maintain Spotify playlists created from [AskReddit](https://www.reddit.com/r/AskReddit) threads!

Playlist | Reddit Thread
---|---
https://open.spotify.com/playlist/7dj7mA1bjzI0N1WZoBvh9j | [What 90s song will always be a banger?](https://www.reddit.com/r/AskReddit/comments/embv3x) 
https://open.spotify.com/playlist/2hrj1QLTLW5grBJXkN1sSg | [Lyrically, what is the best “Fuck You” song of all time?](https://www.reddit.com/r/AskReddit/comments/9k5zfb)
https://open.spotify.com/playlist/6dG6KQIzXHovGevpU1iiGG | [What song reminds you of the best times of your life?](https://www.reddit.com/r/AskReddit/comments/cw1d3h)
https://open.spotify.com/playlist/3nBmmb82z1316vQMmgQWC6 | [What is the best TV theme song?](https://www.reddit.com/r/AskReddit/comments/dykjt8)

Lyrically, what is the best “Fuck You” song of all time?
# How

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
* I get rate limited :(
* Results can be duplicated (or more) if similar comments/titles are upvoted equally.
