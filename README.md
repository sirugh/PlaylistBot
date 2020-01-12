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
    "thread": "embv3x"
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
yarn run v1.13.0
$ node --experimental-modules src/index.mjs
(node:9008) ExperimentalWarning: The ESM module loader is experimental.
Searching reddit thread embv3x
Found 22 songs
[
  {
    searchString: 'Sabotage by Beastie Boys.',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Sabotage+by+Beastie+Boys.',
    id: '4owyLbzoUvDT5Cliz3u5rh',
    name: 'Sabotage (Karaoke Version) [Originally Performed By Beastie Boys]',
    url: 'https://open.spotify.com/track/4owyLbzoUvDT5Cliz3u5rh'
  },
  {
    searchString: 'Regulate - Warren G and Nate Dogg',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Regulate+-+Warren+G+and+Nate+Dogg',
    id: '63XQ1ZH5aqZ8W4fydFwoSv',
    name: 'Saturday (feat. E-40, Too $hort, Nate Dogg)',
    url: 'https://open.spotify.com/track/63XQ1ZH5aqZ8W4fydFwoSv'
  },
  {
    searchString: '[Snoop Dogg - Gin & Juice](https://www.youtube.com/watch?v=DI3yXg-sX5c)',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=[Snoop+Dogg+-+Gin+&+Juice](https://www.youtube.com/watch?v=DI3yXg-sX5c)',
    id: '0WKYRFtH6KKbaNWjsxqm70',
    name: 'Gin And Juice (feat. Dat Nigga Daz)',
    url: 'https://open.spotify.com/track/0WKYRFtH6KKbaNWjsxqm70'
  },
  {
    searchString: 'Nirvana - Come As You Are',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Nirvana+-+Come+As+You+Are',
    id: '4P5KoWXOxwuobLmHXLMobV',
    name: 'Come As You Are',
    url: 'https://open.spotify.com/track/4P5KoWXOxwuobLmHXLMobV'
  },
  {
    searchString: 'Basket Case by Green Day',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Basket+Case+by+Green+Day',
    id: '18WE8zvkOK26MaYWPPsigJ',
    name: 'Basket Case',
    url: 'https://open.spotify.com/track/18WE8zvkOK26MaYWPPsigJ'
  },
  {
    searchString: '1979 - Smashing Pumpkins',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=1979+-+Smashing+Pumpkins',
    id: '5QLHGv0DfpeXLNFo7SFEy1',
    name: '1979 - Remastered 2012',
    url: 'https://open.spotify.com/track/5QLHGv0DfpeXLNFo7SFEy1'
  },
  {
    searchString: 'Zombie - The Cranberries',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Zombie+-+The+Cranberries',
    id: '2IZZqH4K02UIYg5EohpNHF',
    name: 'Zombie',
    url: 'https://open.spotify.com/track/2IZZqH4K02UIYg5EohpNHF'
  },
  {
    searchString: 'Possum Kingdom - Toadies',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Possum+Kingdom+-+Toadies',
    id: '56SkdBKyR2zOkjk6wVFI9s',
    name: 'Possum Kingdom',
    url: 'https://open.spotify.com/track/56SkdBKyR2zOkjk6wVFI9s'
  },
  {
    searchString: 'Cannonball by Breeders',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Cannonball+by+Breeders',
    id: '3ueEOu13wDEfkFRP7hfowm',
    name: 'Cannonball (As Made Famous by The Breeders)',
    url: 'https://open.spotify.com/track/3ueEOu13wDEfkFRP7hfowm'
  },
  {
    searchString: 'Haddaway - what is love',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Haddaway+-+what+is+love',
    id: '4v6jydWBTAIqnyPVNyOAdc',
    name: 'What Is Love',
    url: 'https://open.spotify.com/track/4v6jydWBTAIqnyPVNyOAdc'
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
      'Edit+:+[Link](https://www.youtube.com/watch?v=NIGMUAMevH0)',
    id: '1ru5R5iSawvuMELqKXxLjS',
    name: 'The Impression That I Get',
    url: 'https://open.spotify.com/track/1ru5R5iSawvuMELqKXxLjS'
  },
  {
    searchString: "Gangsta's paradise",
    searchUrl: "https://api.spotify.com/v1/search?limit=1&type=track&query=Gangsta's+paradise",
    id: '7lQWRAjyhTpCWFC0jmclT4',
    name: "Gangsta's Paradise",
    url: 'https://open.spotify.com/track/7lQWRAjyhTpCWFC0jmclT4'
  },
  {
    searchString: '[removed]',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=[removed]',
    id: '5RLw8XEGJaADL7RxpminzK',
    name: 'Removed from Time',
    url: 'https://open.spotify.com/track/5RLw8XEGJaADL7RxpminzK'
  },
  {
    searchString: 'Return of the Mack, Mark Morrison',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Return+of+the+Mack,+Mark+Morrison',
    id: '3jDdpx9PMlfMBS5tOBHFm9',
    name: 'Return of the Mack',
    url: 'https://open.spotify.com/track/3jDdpx9PMlfMBS5tOBHFm9'
  },
  {
    searchString: 'Tubthumping - chumbawamba',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Tubthumping+-+chumbawamba',
    id: '5YScXJKtefsgdskIy60N7A',
    name: 'Tubthumping',
    url: 'https://open.spotify.com/track/5YScXJKtefsgdskIy60N7A'
  },
  {
    searchString: 'Prodigy - Firestarter',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Prodigy+-+Firestarter',
    id: '1GTPxha6U7x9ElVxkQw3OK',
    name: 'Firestarter',
    url: 'https://open.spotify.com/track/1GTPxha6U7x9ElVxkQw3OK'
  },
  {
    searchString: 'Lovefool by the Cardigans',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Lovefool+by+the+Cardigans',
    id: '2gpXQFYDszpPwpyIW1Hu5A',
    name: 'Lovefool (Dance Remix) (Made Popular By The Cardigans) [Vocal Version]',
    url: 'https://open.spotify.com/track/2gpXQFYDszpPwpyIW1Hu5A'
  },
  {
    searchString: 'Ginuwine - Pony',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Ginuwine+-+Pony',
    id: '6mz1fBdKATx6qP4oP1I65G',
    name: 'Pony',
    url: 'https://open.spotify.com/track/6mz1fBdKATx6qP4oP1I65G'
  },
  {
    searchString: 'My Own Worst Enemy - Lit',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=My+Own+Worst+Enemy+-+Lit',
    id: '33iv3wnGMrrDugd7GBso1z',
    name: 'My Own Worst Enemy',
    url: 'https://open.spotify.com/track/33iv3wnGMrrDugd7GBso1z'
  },
  {
    searchString: 'Peaches - Presidents of the United States',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Peaches+-+Presidents+of+the+United+States',
    id: '3VEFybccRTeWSZRkJxDuNR',
    name: 'Peaches',
    url: 'https://open.spotify.com/track/3VEFybccRTeWSZRkJxDuNR'
  },
  {
    searchString: 'Two Princes - Spin doctors',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Two+Princes+-+Spin+doctors',
    id: '4ePP9So5xRzspjLFVVbj90',
    name: 'Two Princes',
    url: 'https://open.spotify.com/track/4ePP9So5xRzspjLFVVbj90'
  },
  {
    searchString: 'Alice Deejay - Better Off Alone',
    searchUrl: 'https://api.spotify.com/v1/search?limit=1&type=track&query=Alice+Deejay+-+Better+Off+Alone',
    id: '48gBfTRel9fajeev7tmLpo',
    name: 'Better Off Alone (Remastered) - 1999 Original Hit Radio',
    url: 'https://open.spotify.com/track/48gBfTRel9fajeev7tmLpo'
  }
]
Done in 3.49s.
```