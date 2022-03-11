import path from "path";
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import snoowrap from "snoowrap";

import { delay, requireJSON } from "./util.mjs";

const config = requireJSON(path.resolve("config.json"));
const secrets = requireJSON(path.resolve("secrets.json"));

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: secrets.spotify.clientId,
  clientSecret: secrets.spotify.clientSecret,
  redirectUri: secrets.spotify.redirectUri,
});

const redditApi = new snoowrap({
  ...secrets.reddit,
});

app.get("/", (req, res) => {
  // If we are alread authed then proceed directly to go.
  if (spotifyApi.getAccessToken()) {
    console.log("Spotify access token already exists");
    res.redirect("/go");
  } else {
    // Otherwise start the auth process.
    const authorizeUrl = spotifyApi.createAuthorizeURL([
      "user-read-private",
      "playlist-modify-public",
    ]);
    console.log("got authorize url", authorizeUrl);
    res.redirect(authorizeUrl);
  }
});

app.get("/spotify_auth", async (req, res) => {
  await spotifyApi.authorizationCodeGrant(req.query.code).then(
    (data) => {
      console.log("setting spotify access and refresh tokens");
      console.log("access_token", data.body["access_token"]);
      console.log("refresh_token", data.body["refresh_token"]);
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      res.redirect("/go");
    },
    (err) => {
      console.error(err);
      res.send("Something went wrong!");
    }
  );
});

app.get("/go", async (req, res) => {
  res.redirect("/done");
  for (let i = 0; i < config.playlists.length; i++) {
    const { thread_name, reddit_thread_id, playlist_id, playlist_name } =
      config.playlists[i];

    console.log(`Searching Reddit thread "${thread_name}...`);
    // TODO: figure out how to limit this query
    let comments = await redditApi
      .getSubmission(reddit_thread_id)
      .comments.fetchMore({
        amount: 100,
      })
      .sort((a, b) => b.ups - a.ups);
    // TODO: Figure out why this returns a 403.
    // .setSuggestedSort('top')

    console.log(`Found ${comments.length} comments.`);

    comments = comments
      .map((comment) => comment.body.trim())
      // dont use deleted or removed comments
      .filter((comment) => {
        const filterTerms = ["[removed]", "[deleted]"];
        return !filterTerms.includes(comment.body);
      });
    // TODO: figure out why dedupe results in an empty array of comments
    // dedupe
    // .filter((comment, index) => comments.indexOf(comment) === index)

    console.log(`Found ${comments.length} comments (after filtering).`);

    console.log("Searching Spotify for songs...");

    // For each comment, search and then pause 100ms before resolving to
    // give the API some time to breathe.
    const results = [];
    for (let index = 0; index < comments.length; index++) {
      const comment = comments[index];
      try {
        await delay(100);
        const result = await searchSpotify(comment);
        results.push(result);
      } catch (err) {
        console.log(`Error adding ${comment} to Spotify:`, err);
      }
    }

    const filteredResults = results.filter((x) => x);
    console.log(`Found ${filteredResults.length} songs on Spotify.`);

    if (!filteredResults.length) return;

    console.log(`Replacing songs on playlist "${playlist_name}"`);
    try {
      // Can only send 100 songs with the API. Eventually we can just
      // split the list and send several update requests.
      const toSend = filteredResults.slice(0, 100);
      await spotifyApi.replaceTracksInPlaylist(
        playlist_id,
        toSend.map((result) => result.uri)
      );
      console.log("Done!");
    } catch (err) {
      console.error("Unable to add tracks to playlist.", err);
    }
  }
});

app.get("/done", (req, res) => {
  res.send("Bot is searching - Give it some time.");
});
app.listen(port, () => console.log(`Bot listening on port ${port}!`));

/**
 * Try to guess what part of the string is the song name. Songs can be
 * difficult to guess. Some search strings may be [song] - [artist] and some
 * may be the inverse. Others may have multiple references, separated by some
 * delimeter. Sometimes text is a markdown link, so we have to parse the text.
 *
 * Potentially async if I end up using some intermediate queries.
 *
 * @param {String} searchString A string of any size or length
 */
const guessTrackAndArtist = async (searchString = "") => {
  // Split on hyphen, or "by" if possible.
  let trackGuess = searchString;
  let artistGuess = "";

  // TODO use markdown parser to extract from a link

  // TODO some smart parsing. Split on - or by, search, and get top result
  // that matches "artistGuess" from split? etc...
  // Using the full string leaves the guesswork to Spotify's algorithm.
  if (searchString.includes("-")) {
    [trackGuess, artistGuess] = searchString.split("-");
  } else if (searchString.includes("by")) {
    [trackGuess, artistGuess] = searchString.split("by");
  }

  // TODO: removed/deleted are making it here...
  //   console.log(`Guess: "${trackGuess}"`);
  return [trackGuess.trim(), artistGuess.trim()];
};

const searchSpotify = async (searchString) => {
  const [trackGuess] = await guessTrackAndArtist(searchString);

  const filterString = [
    "karaoke",
    "made famous by",
    "performed by",
    "originally by",
  ]
    .map((text) => `"${text}"`)
    .join(" NOT ");

  // Sometimes comments can be pretty long. Search by the first 40 characters,
  // which should be longer than most song titles and exclude some common
  // strings that produce covers.
  const query = `${trackGuess.substring(0, 40)} NOT ${filterString}`;

  try {
    const { body } = await spotifyApi.search(query, ["track"], {});

    if (!body.tracks.items.length) {
      return;
    }

    const result = {
      query,
      title: body.tracks.items[0].name,
      artist: body.tracks.items[0].artists[0].name,
      url: body.tracks.items[0].external_urls.spotify,
      uri: body.tracks.items[0].uri,
    };

    // console.log(`QUERY: ${songNameGuess}`);
    // console.log(`RESULT: ${result.title} - ${result.artist}`);

    return result;
  } catch (err) {
    // Noisy as this could happen for _every_ matched song.
    console.error(err);
  }
};
