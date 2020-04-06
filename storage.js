/**
 * @typedef {{
 *   name: string,
 *   value: string
 * }} Secret
 */

/**
 * @exports {Storage}
 */
exports.Storage = class Storage {
    /**
     *
     * @param {{configstore: import("configstore")}} options
     */
    constructor({ configstore }) {
        this.configstore = configstore;
    }

    /**
     * @param {string} name
     * @param {string} secret
     */
    addSecret(name, secret) {
        const secrets = this.configstore.get('secrets') || [];
        secrets.push({ name, value: secret });
        this.configstore.set({ secrets });
    }

    /**
     * @returns {Array<Secret>}
     */
    getSecrets() {
        const secrets = this.configstore.get('secrets') || [];
        return secrets;
    }

    /**
     * @param {string[]} names
     * @returns {number} a number of secrets deleted
     */
    deleteSecrets(names) {
        /**
         * @type {Array<Secret>}
         */
        const secrets = this.configstore.get('secrets') || [];
        const newSecrets = secrets.filter(
            ({ name: secretName }) => !names.includes(secretName)
        );
        const deleted = secrets.length - newSecrets.length;

        if (deleted) {
            this.configstore.set('secrets', newSecrets);
        }
        return deleted;
    }
};
