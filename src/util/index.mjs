import fs from 'fs'

/**
 * Resolves a promise in some milliseconds provided.
 * @param ms milliseconds to resolve in
 */
const delay = ms => {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms)
    })
}

/**
 * Psuedo-require for parsing json files.
 * @param filepath
 * @param encoding
 */
const require = (filepath, encoding = 'utf8') =>
    JSON.parse(fs.readFileSync(filepath, { encoding }))

export { delay, require }
