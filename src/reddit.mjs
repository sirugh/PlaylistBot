import path from 'path';
import { require } from './util.mjs';

const secrets = require(path.resolve("secrets.json"));

// Auth with Reddit
import snoowrap from 'snoowrap'

const { userAgent, clientId, clientSecret, username, password } = secrets.reddit;

const logIn = () => new snoowrap({
    userAgent,
    clientId,
    clientSecret,
    username,
    password
})

export {
    logIn
}