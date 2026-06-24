// crypto.js - Foundation for E2EE Secure Messaging
export const Security = {
    async generateKeyPair() {
        return await window.crypto.subtle.generateKey(
            { name: "RSA-OAEP", modulusLength: 2048, hash: "SHA-256" },
            true, ["encrypt", "decrypt"]
        );
    },

    async encryptText(text, publicKey) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            data
        );
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    }
};
