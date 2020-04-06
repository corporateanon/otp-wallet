const { hri } = require('human-readable-ids');
const inquirer = require('inquirer');
const otplib = require('otplib');
const charm = require('charm');
const sleep = require('sleep-promise');

const gauges = '▏▎▌▋▊▉';
const gaugeLength = 48;

class UI {
    /**
     * @param {{storage:import('./storage').Storage}}
     */
    constructor({ storage }) {
        this.storage = storage;
    }

    /**
     * @param { { secret: string | null, name: string | null } }
     */
    async addSecret({ secret, name }) {
        if (secret === null) {
            const answers = await inquirer.prompt([
                {
                    name: 'secret',
                    type: 'password',
                    validate: (value) => (value.length > 0 ? true : 'Required'),
                },
                {
                    name: 'name',
                    type: 'input',
                    default: hri.random(),
                    validate: (value) => (value.length > 0 ? true : 'Required'),
                },
            ]);

            secret = answers.secret;
            name = answers.name;
        } else {
            if (name === null) {
                name = hri.random();
            }
        }

        this.storage.addSecret(name, secret);
        console.log(`Secret ${name} added`);
    }

    /**
     * @param { { once: boolean } }
     */
    async getSecrets({ once = false }) {
        const ch = charm();
        ch.pipe(process.stdout);

        for (;;) {
            const secrets = this.storage.getSecrets();
            for (const { name, value } of secrets) {
                const token = otplib.authenticator.generate(value);
                console.log(`${token} ${name} `);
            }

            const timeRemaining = otplib.authenticator.timeRemaining();
            const timeUsed = otplib.authenticator.timeUsed();
            const remaining = timeRemaining / (timeRemaining + timeUsed);
            const numPixels = Math.floor(gaugeLength * remaining);
            const numFullBlocks = Math.floor(numPixels / 8);

            const gauge = [];
            for (let i = 0; i < numFullBlocks; i++) {
                gauge.push('█');
            }
            const remainderLength = numPixels % 8;
            if (remainderLength > 0) {
                gauge.push(gauges[remainderLength - 1]);
            }

            console.log(gauge.join('') + ' ');
            if (once) {
                return;
            }
            await sleep(1000);

            ch.up(1 + secrets.length);
        }
    }

    /**
     * @param { { name: string[] } }
     */
    async deleteSecrets({ names }) {
        if (names.length === 0) {
            const answers = await inquirer.prompt([
                {
                    name: 'names',
                    type: 'checkbox',
                    choices: this.storage.getSecrets().map(({ name }) => name),
                },
            ]);
            names = answers.names;
        }
        const deleted = this.storage.deleteSecrets(names);
        console.log(`${deleted} secrets were deleted`);
    }
}

exports.UI = UI;
