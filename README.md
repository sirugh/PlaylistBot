# PlaylistBot

## Hello

Scrapes a reddit thread for top posts, searches Spotify for songs matching post text and creates a playlist from the results.

## Run it!

1) Create a `secrets.json` file in the root.

```json
{
  "reddit": {
    "userAgent": "Your user agent string",
    "clientId": "Your reddit client id",
    "clientSecret": "Your reddit client secret",
    "username": "Your reddit username",
    "password": "Your reddit password",
    "thread": "embv3x"
  },
  "spotify": {
    "clientId": "Your spotify client id",
    "clientSecret": "Your spotify client secret"
  }
}
```

2) `yarn start`
