const { hri } = require('human-readable-ids');
const inquirer = require('inquirer');
const otplib = require('otplib');

const gauges = '▏▎▌▋▊▉';
const gaugeLength = 48;

class UI {
    /**
     * @param {{storage:import('./storage').Storage}} options
     */
    constructor({ storage }) {
        this.storage = storage;
    }

    async addSecret() {
        const answers = await inquirer.prompt([
            {
                name: 'secret',
                type: 'password',
                validate: (value) => (value.length > 0 ? true : 'Required'),
            },
            { name: 'name', type: 'input', default: hri.random() },
        ]);

        this.storage.addSecret(answers.name, answers.secret);
        console.log(`Secret ${answers.name} added`);
    }

    getSecrets() {
        const secrets = this.storage.getSecrets();
        for (const { name, value } of secrets) {
            const token = otplib.authenticator.generate(value);
            console.log(`${token} ${name}`);
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
        console.log(gauge.join(''));
    }
}

exports.UI = UI;
