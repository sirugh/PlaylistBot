const HEADERS = { "User-Agent": "PlaylistBot/2.0 (github.com/sirugh/playlistbot)" };

/**
 * Search a subreddit for threads matching the query.
 * Returns threads sorted by score (descending).
 */
export const searchThreads = async (query, subreddits = ["AskReddit"], limit = 5, time = "all") => {
  const threads = [];

  for (const sub of subreddits) {
    const url = new URL(`https://www.reddit.com/r/${sub}/search.json`);
    url.searchParams.set("q", query);
    url.searchParams.set("sort", "top");
    url.searchParams.set("t", time);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("restrict_sr", "1");

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`Reddit search failed (${res.status}): ${url}`);

    const data = await res.json();
    threads.push(...(data.data?.children?.map((c) => c.data) ?? []));
  }

  return threads.sort((a, b) => b.score - a.score);
};

/**
 * Fetch the top-level comments from a Reddit thread, sorted by score.
 * Returns an array of trimmed comment body strings.
 */
export const getTopComments = async (threadId, limit = 100) => {
  const url = new URL(`https://www.reddit.com/comments/${threadId}.json`);
  url.searchParams.set("sort", "top");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Reddit fetch failed (${res.status}): ${url}`);

  const [, commentsListing] = await res.json();

  return commentsListing.data.children
    .filter((c) => c.kind === "t1")
    .map((c) => c.data.body?.trim())
    .filter((body) => body && body !== "[removed]" && body !== "[deleted]");
};
