import fs from 'fs';

const require = (filepath, encoding = "utf8") =>
    JSON.parse(fs.readFileSync(filepath, { encoding }));

export {
    require
}