# PlaylistBot — AI Assistant Guide

## Project Overview

PlaylistBot is a small Node.js application that auto-populates Spotify playlists by scraping top comments from AskReddit threads. It runs as a local Express server, handles Spotify OAuth, then processes each configured playlist in sequence.

## Tech Stack

- **Runtime:** Node.js >= 12.14.1, ES Modules (`"type": "module"`, `.mjs` extension)
- **Web framework:** Express 4
- **Reddit API:** snoowrap 1.20 (full Reddit API wrapper)
- **Spotify API:** spotify-web-api-node 4.0
- **Linter:** ESLint 6 (`eslint:recommended` + semicolons required)
- **Package manager:** Yarn (lockfile present; prefer `yarn` over `npm`)

## Repository Structure

```
PlaylistBot/
├── src/
│   ├── index.mjs        # Express app, all routes, main bot logic
│   └── util.mjs         # delay() and requireJSON() helpers
├── config.json          # Playlist configuration (committed)
├── secrets.json         # API credentials (gitignored — never commit)
├── sampleData.json      # Example Spotify search results for reference
├── package.json
├── .eslintrc.json
└── README.md
```

There is no build step, no TypeScript, no database, and no frontend framework.

## Development Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Create `secrets.json` in the project root

```json
{
  "reddit": {
    "userAgent": "your-bot/0.0.1 by YourRedditUsername",
    "clientId": "your_reddit_client_id",
    "clientSecret": "your_reddit_client_secret",
    "username": "your_reddit_username",
    "password": "your_reddit_password"
  },
  "spotify": {
    "clientId": "your_spotify_client_id",
    "clientSecret": "your_spotify_client_secret",
    "redirectUri": "http://localhost:3000/spotify_auth"
  }
}
```

`secrets.json` is in `.gitignore`. Never commit it or any credentials.

### 3. Configure playlists in `config.json`

Each entry in the `playlists` array maps a Reddit thread to a Spotify playlist:

```json
{
  "playlists": [
    {
      "thread_name": "Human-readable label for logs",
      "reddit_thread_id": "Reddit submission ID (from URL)",
      "playlist_name": "Spotify playlist name (for logs only)",
      "playlist_id": "Spotify playlist ID"
    }
  ]
}
```

The Spotify playlist must be public ("added to profile" in the Spotify app).

### 4. Run

```bash
yarn start
```

Navigate to `http://localhost:3000` in a browser. The app redirects through Spotify OAuth then kicks off the bot. The `--experimental-modules` flag in the start script is a legacy artifact from older Node; modern Node handles ESM natively.

## Application Flow

```
GET /
  └─ token exists? ──yes──► GET /go
  └─ no ──────────────────► Spotify OAuth → GET /spotify_auth
                                               └─► GET /go

GET /go
  ├─ Immediately redirects browser to GET /done
  └─ Async: for each playlist in config.json:
      1. Fetch top 100 comments from Reddit thread (sorted by upvotes)
      2. Filter out [removed] and [deleted] comments
      3. For each comment, call searchSpotify() with 100ms throttle
      4. Replace all playlist tracks (up to 100) via Spotify API
```

**Important behavior:** `/go` fires `res.redirect("/done")` before the async work starts. The bot runs in the background after the browser is redirected. There is no progress feedback beyond console logs.

## Key Functions

### `guessTrackAndArtist(searchString)` — `src/index.mjs:142`

Parses a raw Reddit comment into `[trackGuess, artistGuess]`. Logic:
- If string contains `-`, splits on it
- Else if contains `by`, splits on it
- Otherwise uses the full string as the track guess

Known limitations (tracked with TODOs in the code): markdown links aren't parsed, `[removed]`/`[deleted]` can leak through the filter, and deduplication is disabled because it produced empty arrays.

### `searchSpotify(searchString)` — `src/index.mjs:163`

Searches Spotify for the first result matching the track guess. Explicitly excludes karaoke/cover strings using NOT operators. Truncates the query to 40 characters to avoid over-specific strings. Returns `{ query, title, artist, url, uri }` or `undefined` if no results.

## Known Issues / TODOs

These are noted with `TODO` comments in `src/index.mjs`:

- Comment deduplication is disabled (`.filter` dedupe returned empty arrays)
- Reddit `.setSuggestedSort('top')` returns 403 — comments are sorted client-side
- Reddit query limit is not capped at the API level — `fetchMore({ amount: 100 })` is used instead
- Markdown links in comments are not parsed, causing the raw markdown syntax to be passed to Spotify search
- `[removed]`/`[deleted]` comments may slip through because the filter checks `comment.body` on already-mapped strings
- Spotify API limit: only the first 100 results are sent to `replaceTracksInPlaylist`

## Code Conventions

- **ES Modules only**: use `import`/`export`, `.mjs` extension for source files
- **Semicolons required** (enforced by ESLint)
- **Async/await** preferred over `.then()` chains (the codebase mixes both — prefer async/await for new code)
- **No TypeScript**, no JSDoc required (existing JSDoc comments are sparse and optional)
- Run `yarn lint` before committing to catch ESLint errors

## Scripts

| Command | Description |
|---|---|
| `yarn start` | Start the bot server on port 3000 |
| `yarn lint` | Run ESLint with auto-fix on `src/**/*.mjs` |
| `yarn test` | Not implemented (exits with error) |

## Adding a New Playlist

1. Find the Reddit thread ID from its URL: `reddit.com/r/AskReddit/comments/<ID>/`
2. Create a public Spotify playlist and copy its ID from the share URL
3. Add an entry to `config.json`
4. Run the bot

## Security Notes

- `secrets.json` must never be committed — it is listed in `.gitignore`
- Reddit credentials are passed directly to snoowrap (username/password OAuth)
- Spotify tokens are stored only in memory and reset on each server restart
- There is no input sanitization on Reddit comment strings before they are used in Spotify search queries — the Spotify SDK handles escaping
