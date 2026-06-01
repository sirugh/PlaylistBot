import fs from "fs";

const requireJSON = (url) => JSON.parse(fs.readFileSync(url, "utf8"));

export { requireJSON };
