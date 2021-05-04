import { readFileSync } from "fs";
import { resolve } from "path";

const readme = readFileSync(resolve(__dirname, '..', '..', 'README.md'), {
    encoding: "utf8"
}).toString();

if (readme.indexOf('v' + process.env.npm_package_version!) === -1) {
    throw new Error("Put the version release notes on readme bro");
}