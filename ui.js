const { hri } = require('human-readable-ids');
const inquirer = require('inquirer');
const otplib = require('otplib');

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
}

exports.UI = UI;
