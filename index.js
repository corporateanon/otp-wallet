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
            'List secrets in real time',
            () => {},
            async () => {
                await ui.getSecrets({ once: false });
            }
        )
        .command(
            'once',
            'List secrets once',
            () => {},
            async () => {
                await ui.getSecrets({ once: true });
            }
        )
        .command(
            'add [secret [name]]',
            'Add a secret',
            (yargs) => {
                yargs
                    .positional('secret', {
                        description: 'secret code',
                        default: null,
                        type: 'string',
                    })
                    .positional('name', {
                        description: 'secret name',
                        default: null,
                        type: 'string',
                    });
            },
            async ({ secret, name }) => {
                await ui.addSecret({ secret, name });
            }
        )
        .command(
            'delete [names..]',
            'Delete a secret',
            (yargs) => {
                yargs.positional('names', {
                    type: 'string',
                    description: 'Names of secrets to delete',
                });
            },
            async ({ names }) => {
                console.log({ names });
                await ui.deleteSecrets({ names });
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
