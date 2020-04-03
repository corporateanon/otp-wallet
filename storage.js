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
};
