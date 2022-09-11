/**
 * Helpers for interacting with Holonym browser extension and for zokrates
 */
import assert from "assert";
import { ethers } from 'ethers';
import { initialize } from 'zokrates-js';

const extensionId = "oehcghhbelloglknnpdgoeammglelgna";
// const extensionId = 'cilbidmppfndfhjafdlngkaabddoofea'; // for tests

// Max length of encrypt-able string using RSA-OAEP with SHA256 where
// modulusLength == 4096: 446 characters.
const maxEncryptableLength = 446;

const serverPublicKey = {
  key_ops: ["encrypt"],
  ext: true,
  kty: "RSA",
  n: "wZQBp5vWiFTU9ORIzlySpULJQB7XuZIZ46CH3DKweg-eukKfU1YGX8H_aNLFzDThSR_Gv7xnZ2AfoN_-EAqrLGf0T310j-FfAbe5JUMvxrH02Zk5LhZw5tu5n4XEJRHIAqJPUy_0vFS4-zfmGLIDpDgidRFh8eg_ghTEkOWybe99cg2qo_sa1m-ANr5j4qzpUFnOjZwvaWyhmBdlu7gtOC15BRwBP97Rp0bNeGEulEpoxPtks8XjgWXJ4MM7L8m2SkyHOTKGrrTXmAStvlbolWnq27S1QqTznMec4s2r9pUpfNwQGbbi7xTruTic-_zuvcvYqJwx-mpG7EQrwNIFK2KvM1PogezS6_2zYRy2uQTqpsLTEsaP-o-J4cylWQ3fikGh2EShzVKhgr1DWOy2Bmv9pZq5C7R_5OpApfwvTt3lFAWFjOez0ggHM9UbuKuUNay_D4bTEOaupBzDbkrn1hymgFuQtO97Wh6bFQKTHqpFiEy-LbPkoTKq6K0wNzsTne8-laBOPpYzTgtV9V_XFnR7EjsAYOaqLYU2pnr8UrhcMqsY1AIQDWvKqKMzDo25g6wQFtYnKQ8xEnVC1pT2P4Dt3Fx4Y6Uzg866rifn7MRpZBfXc5vsOnN46rSQLksWJrt8noxEbBGzi7Qi67O9EE9gWYSW2vWp3N6v81Isx9k",
  e: "AQAB",
  alg: "RSA-OAEP-256",
};

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

async function encryptForExtension(message) {
  const encryptionKey = await getPublicKey();
  const stringifiedMsg = JSON.stringify(message);
  const usingSharding = stringifiedMsg.length > maxEncryptableLength;
  let encryptedMessage; // array<string> if sharding, string if not sharding
  if (usingSharding) {
    encryptedMessage = [];
    for (let i = 0; i < stringifiedMsg.length; i += maxEncryptableLength) {
      const shard = stringifiedMsg.substring(i, i + maxEncryptableLength);
      const encryptedShard = await encrypt(encryptionKey, shard);
      encryptedMessage.push(encryptedShard);
    }
  } else {
    encryptedMessage = await encrypt(encryptionKey, stringifiedMsg);
  }
  return { encryptedMessage: encryptedMessage, sharded: usingSharding };
}

/**
 * Encrypt and store the provided credentials with the Holonym browser extension.
 * @param {Object} credentials creds object from Holonym server
 */
export async function storeCredentials(credentials) {
  const { encryptedMessage, sharded } = await encryptForExtension(credentials);

  // Send encrypted credentials to Holonym extension
  const payload = {
    command: "setHoloCredentials",
    sharded: sharded,
    credentials: encryptedMessage,
  };
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage(extensionId, payload);
}

export async function storeProof(proof) {
  const { encryptedMessage, sharded } = await encryptForExtension(proof);
  const payload = {
    command: 'setProof',
    sharded: sharded,
    proof: encryptedMessage
  }
  console.log('payload...')
  console.log(payload)
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

export function toU32StringArray(bytes) {
  let u32s = chunk(bytes.toString("hex"), 8);
  return u32s.map((x) => parseInt(x, 16).toString());
}
export function chunk(arr, chunkSize) {
  let out = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    out.push(chunk);
  }
  return out;
}
function assertLengthIs(item, length, itemName) {
  const errMsg = `${itemName} must be ${length} bytes but is ${item.length} bytes`;
  assert.equal(item.length, length, errMsg);
}
/**
 * Takes Buffer, properly formats them (according to spec), and returns a hash.
 * See: https://opsci.gitbook.io/untitled/4alwUHFeMIUzhQ8BnUBD/extras/leaves
 * @param {Buffer} issuer Blockchain address of account that issued the credentials
 * @param {Buffer} creds Credentials (e.g., "Alice" or 2 as Buffer)
 * @param {Buffer} secret Hex string representation of 16 bytes
 * @returns {Promise<string>} Blake2s hash (of input data) right-shifted 3 bits. Base 10 number
 * represented as a string.
 */
export async function createSmallLeaf(issuer, creds, secret) {
  assertLengthIs(issuer, 20, "issuer");
  assertLengthIs(creds, 28, "creds");
  assertLengthIs(secret, 16, "secret");
  try {
    const paddedCreds = Buffer.concat([creds], 28);
    const zokratesProvider = await initialize();
    const createLeaf = zokratesProvider.compile(`import "hashes/blake2/blake2s" as blake2s;
    import "utils/casts/u32_array_to_bool_array" as to_bits;
    def shiftRight3Bits(u32[8] input) -> field {
        bool[256] input_as_bits = to_bits(input);
        field mut out = 0;
        for u32 j in 0..253 {
            u32 i = 253 - (j + 1);
            out = out + (input_as_bits[i] ? 2 ** j : 0);
        }
        return out;
    }
    def main(u32[5] address, private u32[7] creds, private u32[4] secret) -> field {
        u32[1][16] preimage = [[...address, ...creds, ...secret]];
        return shiftRight3Bits(blake2s(preimage));
    }`);
    const { witness, output } = zokratesProvider.computeWitness(
      createLeaf,
      [issuer, paddedCreds, secret].map((x) => toU32StringArray(x))
    );
    const hashAsBigNum = ethers.BigNumber.from(output.replaceAll('"', ""));
    return hashAsBigNum.toString();
  } catch (err) {
    console.log(err);
  }
}

/**
 * @param {Array<string>} input 2-item array
 */
export async function poseidonHash(input) {
  const [leftInput, rightInput] = input;
  const zokProvider = await initialize();
  const source = `import "hashes/poseidon/poseidon" as poseidon;
  def main(field[2] input) -> field {
    return poseidon(input);
  }`;
  const poseidonHashArtifacts = zokProvider.compile(source);
  const { witness, output } = zokProvider.computeWitness(poseidonHashArtifacts, [
    [leftInput, rightInput],
  ]);
  return output.replaceAll('"', "");
}

export async function encryptForServer(message) {
  async function encryptShard(message) {
    const algo = {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    };
    let args = ["jwk", serverPublicKey, algo, false, ["encrypt"]];
    const pubKeyAsCryptoKey = await crypto.subtle.importKey(...args);
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    args = ["RSA-OAEP", pubKeyAsCryptoKey, encodedMessage];
    const encryptedMessage = await crypto.subtle.encrypt(...args);
    return JSON.stringify(Array.from(new Uint8Array(encryptedMessage)));
  }

  const usingSharding = message.length > maxEncryptableLength;
  let encryptedMessage; // array<string> if sharding, string if not sharding
  if (usingSharding) {
    encryptedMessage = [];
    for (let i = 0; i < message.length; i += maxEncryptableLength) {
      const shard = message.substring(i, i + maxEncryptableLength);
      const encryptedShard = await encryptShard(shard);
      encryptedMessage.push(encryptedShard);
    }
  } else {
    encryptedMessage = await encryptShard(message);
  }
  return { encryptedMessage: encryptedMessage, sharded: usingSharding };
}
