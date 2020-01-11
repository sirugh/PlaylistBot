import path from 'path';

import * as Reddit from './reddit.mjs';
import * as Spotify from './spotify.mjs';
import { require } from './util.mjs';

const secrets = require(path.resolve("secrets.json"));

const run = async () => {
    const spotifyToken = await Spotify.logIn();
    const authedReddit = Reddit.logIn();
    const submission = authedReddit.getSubmission(secrets.reddit.thread)

    // TODO: figure out how to limit this query
    const comments = await submission.comments
        .filter(comment => comment.ups > 1000) // only use comments with > 1000 upvotes
        .sort((a, b) => b.ups - a.ups)

    Promise.all(
        comments
            .map(async comment => {
                const results = await Spotify.search(spotifyToken, comment.body)
                return results;
            })

    ).then(results => {
        const filteredResults = results.filter(x => x)
        // Log all found results
        console.log(`Found ${filteredResults.length} songs`)
        console.log(filteredResults)
    })
}

run()