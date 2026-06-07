import fs from "fs";
import { authenticate, getMe, searchTrack, createPlaylist, replacePlaylistTracks } from "./spotify.mjs";
import { searchThreads, getTopComments } from "./reddit.mjs";
import { createExtractor } from "./claude.mjs";

const requireJSON = (url) => JSON.parse(fs.readFileSync(url, "utf8"));

const config = requireJSON(new URL("../config.json", import.meta.url));
const secrets = requireJSON(new URL("../secrets.json", import.meta.url));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const {
  threads_per_search = 1,
  comments_per_thread = 100,
  tracks_per_playlist = 100,
  claude_model,
} = config.options ?? {};

const apiKey = process.env.ANTHROPIC_API_KEY ?? secrets.anthropic?.apiKey;
const extractSongs = createExtractor(apiKey, claude_model);

const run = async () => {
  // ── Spotify OAuth ────────────────────────────────────────────────────────
  console.log("=== Authenticating with Spotify ===");
  const { access_token } = await authenticate(
    secrets.spotify.clientId,
    secrets.spotify.clientSecret,
    secrets.spotify.redirectUri
  );
  const me = await getMe(access_token);
  console.log(`Logged in as: ${me.display_name ?? me.id}\n`);

  const summary = [];

  // ── Process each search ───────────────────────────────────────────────────
  for (const search of config.searches) {
    const { query, subreddits = ["AskReddit"], time = "all", playlist_name, playlist_id } = search;

    console.log(`=== "${playlist_name}" ===`);
    console.log(`Searching Reddit for: "${query}"`);

    // 1. Find the most relevant/upvoted threads
    const threads = await searchThreads(query, subreddits, threads_per_search * 3, time);
    if (!threads.length) {
      console.log("No threads found, skipping.\n");
      summary.push({ playlist_name, status: "skipped — no threads found" });
      continue;
    }
    const topThreads = threads.slice(0, threads_per_search);
    console.log(`Using: ${topThreads.map((t) => `"${t.title}" (↑${t.score})`).join(", ")}`);

    // 2. Collect and deduplicate comments across threads
    const allComments = [];
    for (const thread of topThreads) {
      await delay(500); // be polite to the Reddit API
      const comments = await getTopComments(thread.id, comments_per_thread);
      allComments.push(...comments);
    }
    const uniqueComments = [...new Set(allComments)];
    console.log(`Collected ${uniqueComments.length} unique comments.`);

    // 3. Extract song names using Claude
    console.log("Extracting songs with Claude...");
    const rawSongs = await extractSongs(uniqueComments);

    // Deduplicate by lowercase title
    const seen = new Set();
    const songs = rawSongs.filter(({ title }) => {
      const key = title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    console.log(`Extracted ${songs.length} unique songs.`);

    // 4. Search Spotify for each song
    console.log("Searching Spotify...");
    const uris = [];
    for (const { title, artist } of songs) {
      if (uris.length >= tracks_per_playlist) break;
      try {
        await delay(100);
        const track = await searchTrack(title, artist, access_token);
        if (track) {
          console.log(`  ✓ "${track.name}" — ${track.artists[0].name}`);
          uris.push(track.uri);
        }
      } catch (err) {
        console.error(`  ✗ "${title}": ${err.message}`);
      }
    }
    console.log(`Found ${uris.length} tracks on Spotify.`);

    if (!uris.length) {
      console.log("No tracks found, skipping playlist update.\n");
      summary.push({ playlist_name, status: "skipped — no Spotify tracks found" });
      continue;
    }

    // 5. Create or update the playlist
    let targetId = playlist_id;
    if (!targetId) {
      const pl = await createPlaylist(me.id, playlist_name, access_token);
      targetId = pl.id;
      console.log(`Created new playlist (ID: ${targetId})`);
      console.log(`  → Add "playlist_id": "${targetId}" to this entry in config.json to reuse it.`);
    }

    await replacePlaylistTracks(targetId, uris, access_token);
    console.log(`Updated "${playlist_name}" with ${uris.length} tracks.\n`);
    summary.push({ playlist_name, status: `updated with ${uris.length} tracks` });
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("=== Summary ===");
  for (const { playlist_name, status } of summary) {
    console.log(`  ${playlist_name}: ${status}`);
  }
};

run().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
