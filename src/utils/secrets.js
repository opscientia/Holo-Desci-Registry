/**
 * Helpers for interacting with Holonym browser extension
 */

const extensionId = "oehcghhbelloglknnpdgoeammglelgna";

// Max length of encrypt-able string using RSA-OAEP with SHA256 where
// modulusLength == 4096: 446 characters.
const maxEncryptableLength = 446;

/**
 * Request from the Holo browser extension the user's public key.
 */
async function getPublicKey() {
  return new Promise((resolve) => {
    const message = { command: "getHoloPublicKey" };
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(extensionId, message, (resp) => {
      resolve(resp);
    });
  });
}

/**
 * @param {SubtleCrypto.JWK} publicKey
 * @param {string} message
 * @returns {Promise<string>} Encrypted message
 */
async function encrypt(publicKey, message = "hello world!") {
  const algo = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  };
  let args = ["jwk", publicKey, algo, false, ["encrypt"]];
  const pubKeyAsCryptoKey = await window.crypto.subtle.importKey(...args);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  args = ["RSA-OAEP", pubKeyAsCryptoKey, encodedMessage];
  const encryptedMessage = await window.crypto.subtle.encrypt(...args);
  return JSON.stringify(Array.from(new Uint8Array(encryptedMessage)));
}

async function encryptCredentials(decryptedCreds) {
  const encryptionKey = await getPublicKey();
  const stringifiedCreds = JSON.stringify(decryptedCreds);
  const usingSharding = stringifiedCreds.length > maxEncryptableLength;
  let encryptedCreds; // array<string> if sharding, string if not sharding
  if (usingSharding) {
    encryptedCreds = [];
    for (let i = 0; i < stringifiedCreds.length; i += maxEncryptableLength) {
      const shard = stringifiedCreds.substring(i, i + maxEncryptableLength);
      const encryptedShard = await encrypt(encryptionKey, shard);
      encryptedCreds.push(encryptedShard);
    }
  } else {
    encryptedCreds = await encrypt(encryptionKey, stringifiedCreds);
  }
  return { encryptedCreds: encryptedCreds, sharded: usingSharding };
}

/**
 * Encrypt and store the provided credentials with the Holonym browser extension.
 * @param {Object} credentials creds object from Holonym server
 */
export async function storeCredentials(credentials) {
  const { encryptedCreds, sharded } = await encryptCredentials(credentials);

  // Send encrypted credentials to Holonym extension
  const payload = {
    command: "setHoloCredentials",
    sharded: sharded,
    credentials: encryptedCreds,
  };
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage(extensionId, payload);
}

// For case where user hasn't registered prior to attempting to store credentials
export function getIsHoloRegistered() {
  return new Promise((resolve) => {
    const payload = {
      command: "holoGetIsRegistered",
    };
    const callback = (resp) => resolve(resp.isRegistered);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(extensionId, payload, callback);
  });
}
