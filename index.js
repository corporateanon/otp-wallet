#!/usr/bin/env node

const { Storage } = require('./storage');
const { UI } = require('./ui');
const Configstore = require('configstore');
const packageJson = require('./package.json');
const yargs = require('yargs');

const main = async () => {
    const configstore = new Configstore(packageJson.name, {
        secrets: [],
    });
    const storage = new Storage({ configstore });
    const ui = new UI({ storage });

    yargs
        .command(
            '$0',
            'List secrets',
            () => {},
            () => {
                ui.getSecrets();
            }
        )
        .command(
            'add',
            'Add a secret',
            () => {},
            (argv) => {
                ui.addSecret();
            }
        ).argv;
};

main().catch((e) => {
    console.error(e.stack);
    process.exit(1);
});

// const path = require('path');
// const os = require('os');
// const fs = require('fs');
// const { promisify } = require('util');
// const otplib = require('otplib');

// const readFile = promisify(fs.readFile);

// const main = async () => {
//     const secrets = JSON.parse(
//         await readFile(
//             path.join(os.homedir(), '.otp-wallet', 'authenticator.json'),
//             'utf8'
//         )
//     );
//     for (const [name, secret] of Object.entries(secrets)) {
//         console.log(`${name}\t${otplib.authenticator.generate(secret)}`);
//     }
// };

// main().catch(e => {
//     console.error(e.stack);
//     process.exit(1);
// });
