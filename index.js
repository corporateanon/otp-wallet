#!/usr/bin/env node

const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');
const otplib = require('otplib');

const readFile = promisify(fs.readFile);

const main = async () => {
    const secrets = JSON.parse(
        await readFile(
            path.join(os.homedir(), '.otp', 'authenticator.json'),
            'utf8'
        )
    );
    for (const [name, secret] of Object.entries(secrets)) {
        console.log(`${name}\t${otplib.authenticator.generate(secret)}`);
    }
};

main().catch(e => {
    console.error(e.stack);
    process.exit(1);
});
