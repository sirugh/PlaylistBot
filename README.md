# PlaylistBot

## Hello

Scrapes a reddit thread for top posts, searches Spotify for songs matching post text and creates a playlist from the results.

## How To

1) Create a `secrets.json` file in the root.

```json
{
  "reddit": {
    "userAgent": "Your user agent string",
    "clientId": "Your reddit client id",
    "clientSecret": "Your reddit client secret",
    "username": "Your reddit username",
    "password": "Your reddit password",
  },
  "spotify": {
    "clientId": "Your spotify client id",
    "clientSecret": "Your spotify client secret"
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
Found 19 songs on Spotify.
[
  {
    searchString: 'Regulate - Warren G and Nate Dogg',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Regulate+-+Warren+G+and+Nate+Dogg+NOT+karaoke',
    id: '63XQ1ZH5aqZ8W4fydFwoSv',
    title: 'Saturday (feat. E-40, Too $hort, Nate Dogg)',
    artist: 'Warren G',
    url: 'https://open.spotify.com/track/63XQ1ZH5aqZ8W4fydFwoSv',
    uri: 'spotify:track:63XQ1ZH5aqZ8W4fydFwoSv'
  },
  {
    searchString: '[Snoop Dogg - Gin & Juice](https://www.youtube.com/watch?v=DI3yXg-sX5c)',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=[Snoop+Dogg+-+Gin+&+Juice](https://www.youtube.com/watch?v=DI3yXg-sX5c)+NOT+karaoke',
    id: '0WKYRFtH6KKbaNWjsxqm70',
    title: 'Gin And Juice (feat. Dat Nigga Daz)',
    artist: 'Snoop Dogg',
    url: 'https://open.spotify.com/track/0WKYRFtH6KKbaNWjsxqm70',
    uri: 'spotify:track:0WKYRFtH6KKbaNWjsxqm70'
  },
  {
    searchString: 'Nirvana - Come As You Are',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Nirvana+-+Come+As+You+Are+NOT+karaoke',
    id: '4P5KoWXOxwuobLmHXLMobV',
    title: 'Come As You Are',
    artist: 'Nirvana',
    url: 'https://open.spotify.com/track/4P5KoWXOxwuobLmHXLMobV',
    uri: 'spotify:track:4P5KoWXOxwuobLmHXLMobV'
  },
  {
    searchString: 'Basket Case by Green Day',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Basket+Case+by+Green+Day+NOT+karaoke',
    id: '4zaIHogPGuRTf5TaleAfny',
    title: 'Basket Case (Made Famous by Green Day)',
    artist: 'Among All Tragedies',
    url: 'https://open.spotify.com/track/4zaIHogPGuRTf5TaleAfny',
    uri: 'spotify:track:4zaIHogPGuRTf5TaleAfny'
  },
  {
    searchString: '1979 - Smashing Pumpkins',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=1979+-+Smashing+Pumpkins+NOT+karaoke',
    id: '5QLHGv0DfpeXLNFo7SFEy1',
    title: '1979 - Remastered 2012',
    artist: 'The Smashing Pumpkins',
    url: 'https://open.spotify.com/track/5QLHGv0DfpeXLNFo7SFEy1',
    uri: 'spotify:track:5QLHGv0DfpeXLNFo7SFEy1'
  },
  {
    searchString: 'Zombie - The Cranberries',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Zombie+-+The+Cranberries+NOT+karaoke',
    id: '2IZZqH4K02UIYg5EohpNHF',
    title: 'Zombie',
    artist: 'The Cranberries',
    url: 'https://open.spotify.com/track/2IZZqH4K02UIYg5EohpNHF',
    uri: 'spotify:track:2IZZqH4K02UIYg5EohpNHF'
  },
  {
    searchString: 'Possum Kingdom - Toadies',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Possum+Kingdom+-+Toadies+NOT+karaoke',
    id: '56SkdBKyR2zOkjk6wVFI9s',
    title: 'Possum Kingdom',
    artist: 'Toadies',
    url: 'https://open.spotify.com/track/56SkdBKyR2zOkjk6wVFI9s',
    uri: 'spotify:track:56SkdBKyR2zOkjk6wVFI9s'
  },
  {
    searchString: 'Haddaway - what is love',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Haddaway+-+what+is+love+NOT+karaoke',
    id: '4v6jydWBTAIqnyPVNyOAdc',
    title: 'What Is Love',
    artist: 'Haddaway',
    url: 'https://open.spotify.com/track/4v6jydWBTAIqnyPVNyOAdc',
    uri: 'spotify:track:4v6jydWBTAIqnyPVNyOAdc'
  },
  {
    searchString: 'The Impression That I Get  -  The Mighty Mighty Bosstones\n' +
      '\n' +
      '&#x200B;\n' +
      '\n' +
      'Edit : [Link](https://www.youtube.com/watch?v=NIGMUAMevH0)',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=The+Impression+That+I+Get++-++The+Mighty+Mighty+Bosstones\n' +
      '\n' +
      '&#x200B;\n' +
      '\n' +
      'Edit+:+[Link](https://www.youtube.com/watch?v=NIGMUAMevH0)+NOT+karaoke',
    id: '1ru5R5iSawvuMELqKXxLjS',
    title: 'The Impression That I Get',
    artist: 'The Mighty Mighty Bosstones',
    url: 'https://open.spotify.com/track/1ru5R5iSawvuMELqKXxLjS',
    uri: 'spotify:track:1ru5R5iSawvuMELqKXxLjS'
  },
  {
    searchString: "Gangsta's paradise",
    searchUrl: "https://api.spotify.com/v1/search?limit=1&type=track&query=Gangsta's+paradise+NOT+karaoke",
    id: '7lQWRAjyhTpCWFC0jmclT4',
    title: "Gangsta's Paradise",
    artist: 'Coolio',
    url: 'https://open.spotify.com/track/7lQWRAjyhTpCWFC0jmclT4',
    uri: 'spotify:track:7lQWRAjyhTpCWFC0jmclT4'
  },
  {
    searchString: 'Return of the Mack, Mark Morrison',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Return+of+the+Mack,+Mark+Morrison+NOT+karaoke',
    id: '3jDdpx9PMlfMBS5tOBHFm9',
    title: 'Return of the Mack',
    artist: 'Mark Morrison',
    url: 'https://open.spotify.com/track/3jDdpx9PMlfMBS5tOBHFm9',
    uri: 'spotify:track:3jDdpx9PMlfMBS5tOBHFm9'
  },
  {
    searchString: 'Tubthumping - chumbawamba',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Tubthumping+-+chumbawamba+NOT+karaoke',
    id: '5YScXJKtefsgdskIy60N7A',
    title: 'Tubthumping',
    artist: 'Chumbawamba',
    url: 'https://open.spotify.com/track/5YScXJKtefsgdskIy60N7A',
    uri: 'spotify:track:5YScXJKtefsgdskIy60N7A'
  },
  {
    searchString: 'Prodigy - Firestarter',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Prodigy+-+Firestarter+NOT+karaoke',
    id: '1GTPxha6U7x9ElVxkQw3OK',
    title: 'Firestarter',
    artist: 'The Prodigy',
    url: 'https://open.spotify.com/track/1GTPxha6U7x9ElVxkQw3OK',
    uri: 'spotify:track:1GTPxha6U7x9ElVxkQw3OK'
  },
  {
    searchString: 'Lovefool by the Cardigans',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Lovefool+by+the+Cardigans+NOT+karaoke',
    id: '5U6ujxB6lZSBHm0AfJZbnE',
    title: 'Lovefool (Αs performed by The Cardigans)',
    artist: 'Pop Music Workshop',
    url: 'https://open.spotify.com/track/5U6ujxB6lZSBHm0AfJZbnE',
    uri: 'spotify:track:5U6ujxB6lZSBHm0AfJZbnE'
  },
  {
    searchString: 'Ginuwine - Pony',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Ginuwine+-+Pony+NOT+karaoke',
    id: '6mz1fBdKATx6qP4oP1I65G',
    title: 'Pony',
    artist: 'Ginuwine',
    url: 'https://open.spotify.com/track/6mz1fBdKATx6qP4oP1I65G',
    uri: 'spotify:track:6mz1fBdKATx6qP4oP1I65G'
  },
  {
    searchString: 'My Own Worst Enemy - Lit',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=My+Own+Worst+Enemy+-+Lit+NOT+karaoke',
    id: '33iv3wnGMrrDugd7GBso1z',
    title: 'My Own Worst Enemy',
    artist: 'Lit',
    url: 'https://open.spotify.com/track/33iv3wnGMrrDugd7GBso1z',
    uri: 'spotify:track:33iv3wnGMrrDugd7GBso1z'
  },
  {
    searchString: 'Peaches - Presidents of the United States',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Peaches+-+Presidents+of+the+United+States+NOT+karaoke',
    id: '3VEFybccRTeWSZRkJxDuNR',
    title: 'Peaches',
    artist: 'The Presidents Of The United States Of America',
    url: 'https://open.spotify.com/track/3VEFybccRTeWSZRkJxDuNR',
    uri: 'spotify:track:3VEFybccRTeWSZRkJxDuNR'
  },
  {
    searchString: 'Two Princes - Spin doctors',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Two+Princes+-+Spin+doctors+NOT+karaoke',
    id: '4ePP9So5xRzspjLFVVbj90',
    title: 'Two Princes',
    artist: 'Spin Doctors',
    url: 'https://open.spotify.com/track/4ePP9So5xRzspjLFVVbj90',
    uri: 'spotify:track:4ePP9So5xRzspjLFVVbj90'
  },
  {
    searchString: 'Alice Deejay - Better Off Alone',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Alice+Deejay+-+Better+Off+Alone+NOT+karaoke',
    id: '48gBfTRel9fajeev7tmLpo',
    title: 'Better Off Alone (Remastered) - 1999 Original Hit Radio',
    artist: 'Alice Deejay',
    url: 'https://open.spotify.com/track/48gBfTRel9fajeev7tmLpo',
    uri: 'spotify:track:48gBfTRel9fajeev7tmLpo'
  }
]
Done in 3.42s.
```
