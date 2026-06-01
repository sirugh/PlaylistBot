import express from "express";
import { randomUUID } from "crypto";
import SpotifyWebApi from "spotify-web-api-node";
import snoowrap from "snoowrap";
import { setTimeout as delay } from "timers/promises";

import { requireJSON } from "./util.mjs";

const config = requireJSON(new URL("../config.json", import.meta.url));
const secrets = requireJSON(new URL("../secrets.json", import.meta.url));

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: secrets.spotify.clientId,
  clientSecret: secrets.spotify.clientSecret,
  redirectUri: secrets.spotify.redirectUri,
});

const redditApi = new snoowrap({ ...secrets.reddit });

const FILTERED_BODIES = new Set(["[removed]", "[deleted]"]);

// Cover/karaoke filter applied to every Spotify search
const COVER_FILTERS = ["karaoke", "made famous by", "performed by", "originally by"]
  .map((t) => `NOT "${t}"`)
  .join(" ");

let oauthState = null;

app.get("/", (req, res) => {
  if (spotifyApi.getAccessToken()) {
    console.log("Spotify access token already exists.");
    res.redirect("/go");
  } else {
    oauthState = randomUUID();
    const authorizeUrl = spotifyApi.createAuthorizeURL(
      ["user-read-private", "playlist-modify-public"],
      oauthState
    );
    res.redirect(authorizeUrl);
  }
});

app.get("/spotify_auth", async (req, res) => {
  const { code, state } = req.query;
  if (!code || state !== oauthState) {
    res.status(400).send("Invalid OAuth callback.");
    return;
  }
  oauthState = null;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.setRefreshToken(data.body["refresh_token"]);
    console.log("Spotify tokens set.");
    res.redirect("/go");
  } catch (err) {
    console.error("Spotify auth error:", err);
    res.status(500).send("Spotify authentication failed.");
  }
});

app.get("/go", async (req, res) => {
  res.redirect("/done");

  for (const { thread_name, reddit_thread_id, playlist_id, playlist_name } of config.playlists) {
    try {
      console.log(`Searching Reddit thread "${thread_name}"...`);

      // fetchMore retrieves up to `amount` additional comments; sort client-side
      // because setSuggestedSort('top') returns 403 from the Reddit API.
      let comments = await redditApi
        .getSubmission(reddit_thread_id)
        .comments.fetchMore({ amount: 100 })
        .sort((a, b) => b.ups - a.ups);

      console.log(`Found ${comments.length} comments.`);

      comments = comments
        .map((comment) => comment.body.trim())
        .filter((comment) => !FILTERED_BODIES.has(comment))
        .filter((comment, i, arr) => arr.indexOf(comment) === i);

      console.log(`Found ${comments.length} comments (after filtering and deduplication).`);
      console.log("Searching Spotify for songs...");

      const results = [];
      for (const comment of comments) {
        try {
          await delay(100);
          const result = await searchSpotify(comment);
          if (result) results.push(result);
        } catch (err) {
          console.log(`Error searching Spotify for "${comment}":`, err);
        }
      }

      console.log(`Found ${results.length} songs on Spotify.`);

      if (!results.length) {
        console.log(`No songs found for "${playlist_name}", skipping.`);
        continue;
      }

      console.log(`Replacing songs on playlist "${playlist_name}"...`);
      // Spotify API limit: replaceTracksInPlaylist accepts at most 100 URIs.
      await spotifyApi.replaceTracksInPlaylist(
        playlist_id,
        results.slice(0, 100).map((r) => r.uri)
      );
      console.log(`Done updating "${playlist_name}".`);
    } catch (err) {
      console.error(`Error processing playlist "${playlist_name}":`, err);
    }
  }
});

app.get("/done", (req, res) => {
  res.send("Bot is running — check the console for progress.");
});

app.listen(port, () => console.log(`Bot listening on port ${port}!`));

/**
 * Parses a raw Reddit comment into [trackGuess, artistGuess].
 * Splits on " - " (hyphen) or " by " (word boundary) if present.
 */
const guessTrackAndArtist = (searchString = "") => {
  let trackGuess = searchString;
  let artistGuess = "";

  if (searchString.includes("-")) {
    [trackGuess, artistGuess] = searchString.split("-");
  } else if (/ by /i.test(searchString)) {
    // Use regex to avoid splitting words that contain "by" (e.g. "somebody")
    [trackGuess, artistGuess] = searchString.split(/ by /i);
  }

  return [trackGuess.trim(), artistGuess.trim()];
};

const searchSpotify = async (searchString) => {
  const [trackGuess] = guessTrackAndArtist(searchString);

  // Truncate to 40 chars to avoid over-specific strings, then exclude covers.
  const query = `${trackGuess.substring(0, 40)} ${COVER_FILTERS}`;

  try {
    const { body } = await spotifyApi.search(query, ["track"]);

    if (!body.tracks.items.length) return;

    const track = body.tracks.items[0];
    return {
      query,
      title: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify,
      uri: track.uri,
    };
  } catch (err) {
    console.error(`Spotify search error for "${query}":`, err);
  }
};
