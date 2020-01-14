# PlaylistBot

I make/maintain Spotify playlists created from [AskReddit](https://www.reddit.com/r/AskReddit) threads!

Playlist | Reddit Thread
---|---
https://open.spotify.com/playlist/7dj7mA1bjzI0N1WZoBvh9j | [What 90s song will always be a banger?](https://www.reddit.com/r/AskReddit/comments/embv3x) 
https://open.spotify.com/playlist/2hrj1QLTLW5grBJXkN1sSg | [Lyrically, what is the best “Fuck You” song of all time?](https://www.reddit.com/r/AskReddit/comments/9k5zfb)
https://open.spotify.com/playlist/6dG6KQIzXHovGevpU1iiGG | [What song reminds you of the best times of your life?](https://www.reddit.com/r/AskReddit/comments/cw1d3h)
https://open.spotify.com/playlist/3nBmmb82z1316vQMmgQWC6 | [What is the best TV theme song?](https://www.reddit.com/r/AskReddit/comments/dykjt8)
https://open.spotify.com/playlist/4559hsM6qpMf6kO4nJMG1a | [What's your favorite underrated song that isn't very popular by a very popular band/musician?](https://www.reddit.com/r/Music/comments/a2b4tj/whats_your_favorite_underrated_song_that_isnt/)

You may notice interesting results. This is because:

* Search strings are difficult. Comments come in many shapes and sizes so I do my best to guess what song name is being requested.
* Spotify search returns covers/remixes as the first result sometimes -- For example, `Basket Case by Green Day` returns a cover while `query=Basket Case` returns the original.
* I get rate limited :(
* Results can be duplicated (or more) if similar comments/titles are upvoted equally.

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

2) Update your `config.json` with your own playlist id and the id for the reddit thread you want to scan.

3) Run it with `yarn start`.

```bash
$ yarn start
yarn run v1.21.1
$ node --experimental-modules src/index.mjs
(node:968) ExperimentalWarning: The ESM module loader is experimental.
Authorizing with Spotify...
Searching Reddit thread embv3x...
Searching Reddit thread 9k5zfb...
Searching Reddit thread cw1d3h...
Searching Reddit thread dykjt8...
Found 110 Reddit comments (after filtering).
Found 103 Reddit comments (after filtering).
Found 40 Reddit comments (after filtering).
Found 70 Reddit comments (after filtering).
Found 18 songs on Spotify.
Replacing songs on playlist...
Found 47 songs on Spotify.
Replacing songs on playlist...
Found 45 songs on Spotify.
Replacing songs on playlist...
Found 53 songs on Spotify.
Replacing songs on playlist...
Done in 28.68s.
```
