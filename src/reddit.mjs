// Auth with Reddit
import snoowrap from 'snoowrap'

const logIn = ({ userAgent, clientId, clientSecret, username, password }) =>
    new snoowrap({
        userAgent,
        clientId,
        clientSecret,
        username,
        password
    })

export { logIn }
