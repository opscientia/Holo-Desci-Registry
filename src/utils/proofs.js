import { ethers } from "ethers";
import { initialize } from "zokrates-js";
import lobby3ProvingKey from "./lobby3Proof.proving.key.json";
import onAddLeafProvingKey from "./onAddLeaf.proving.key.json";

const createLeafCode = `import "hashes/poseidon/poseidon" as poseidon;
def main(field address, private field secret, private field countryCode, private field subdivision, private field completedAt, private field birthdate) -> field {
    return poseidon([address, secret, countryCode, subdivision, completedAt, birthdate]);
}`;
const lobby3ProofCode = `import "hashes/poseidon/poseidon" as poseidon;
const u32 DEPTH = 14; // TODO: Modify before production
const u32 ARITY=5; // Quinary tree
def main(field address, field countryCode, private field subdivision, private field completedAt, private field birthdate, private field nullifier, field root, private field leaf, private field[DEPTH][ARITY] path, private u32[DEPTH] indices) {
    // assert valid preimage
    field[6] preimage = [address, nullifier, countryCode, subdivision, completedAt, birthdate];
    assert(poseidon(preimage) == leaf);
    
    // Merkle proof
    field mut digest = leaf;
    for u32 i in 0..DEPTH {
        // At each step, check for the digest in the next level of path, then calculate the new digest
        assert(path[i][indices[i]] == digest);
        digest = poseidon(path[i]);
    }
    assert(digest == root);
    return;
}`;
const onAddLeaf = `import "hashes/poseidon/poseidon" as poseidon;
def main(field signedLeaf, field newLeaf, field address, private field countryCode, private field subdivision, private field completedAt, private field birthdate, private field oldSecret, private field newSecret) {
    field[6] oldPreimage = [address, oldSecret, countryCode, subdivision, completedAt, birthdate];
    field[6] newPreimage = [address, newSecret, countryCode, subdivision, completedAt, birthdate];
    assert(poseidon(oldPreimage) == signedLeaf);
    assert(poseidon(newPreimage) == newLeaf);
    return;
}`;
let zokProvider;
let createLeafArtifacts;
let lobby3ProofArtifacts;
let onAddLeafArtifacts;
initialize().then((zokratesProvider) => {
  zokProvider = zokratesProvider;
  createLeafArtifacts = zokProvider.compile(createLeafCode);
  lobby3ProofArtifacts = zokProvider.compile(lobby3ProofCode);
  onAddLeafArtifacts = zokProvider.compile(onAddLeaf);
});

/**
 * @param {string} issuer Hex string
 * @param {string} secret Hex string representing 16 bytes
 * @param {number} countryCode
 * @param {string} subdivision UTF-8
 * @param {string} completedAt Hex string representing 3 bytes
 * @param {string} birthdate Hex string representing 3 bytes
 */
export async function createLeaf(
  issuer,
  secret,
  countryCode,
  subdivision,
  completedAt,
  birthdate
) {
  if (!zokProvider) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // TODO: Make this more sophisticated. Wait for zokProvider to be set or for timeout (e.g., 10s)
    await sleep(5000);
  }
  const args = [
    ethers.BigNumber.from(issuer).toString(),
    ethers.BigNumber.from(secret).toString(),
    ethers.BigNumber.from(countryCode).toString(),
    ethers.BigNumber.from(new TextEncoder("utf-8").encode(subdivision)).toString(),
    ethers.BigNumber.from(completedAt).toString(),
    ethers.BigNumber.from(birthdate).toString(),
  ];
  const { witness, output } = zokProvider.computeWitness(createLeafArtifacts, args);
  return output.replaceAll('"', "");
}

async function testCreateLeaf() {
  const issuer = "0x0000000000000000000000000000000000000000";
  const secret = "0x00000000000000000000000000000000";
  const countryCode = 2;
  const subdivision = "NY";
  const completedAt = "0x123456";
  const birthdate = "0x123456";
  const leaf = await createLeaf(
    issuer,
    secret,
    countryCode,
    subdivision,
    completedAt,
    birthdate
  );
  console.log("leaf...");
  console.log(leaf);
}

/**
 * @param {string} issuer Hex string
 * @param {string} secret Hex string representing 16 bytes
 * @param {number} countryCode
 * @param {string} subdivision UTF-8
 * @param {string} completedAt Hex string representing 3 bytes
 * @param {string} birthdate Hex string representing 3 bytes
 * @param {Array<Array<string>>} path Numbers represented as strings
 * @param {Array<string>} indices Numbers represented as strings
 */
export async function lobby3Proof(
  issuer,
  countryCode,
  subdivision,
  completedAt,
  birthdate,
  secret,
  root,
  leaf,
  path,
  indices
) {
  if (!zokProvider) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // TODO: Make this more sophisticated. Wait for zokProvider to be set or for timeout (e.g., 10s)
    await sleep(5000);
  }
  const args = [
    ethers.BigNumber.from(issuer).toString(),
    ethers.BigNumber.from(countryCode).toString(),
    ethers.BigNumber.from(new TextEncoder("utf-8").encode(subdivision)).toString(),
    ethers.BigNumber.from(completedAt).toString(),
    ethers.BigNumber.from(birthdate).toString(),
    ethers.BigNumber.from(secret).toString(),
    ethers.BigNumber.from(root).toString(),
    ethers.BigNumber.from(leaf).toString(),
    // TODO: path
    // TODO: indices
  ];
  const { witness, output } = zokProvider.computeWitness(lobby3ProofArtifacts, args);
  const pk = new Uint8Array(lobby3ProvingKey.data);
  const proof = zokProvider.generateProof(lobby3ProofArtifacts.program, witness, pk);
  return proof;
}

/**
 * @param {string} signedLeaf Number represented as string
 * @param {string} newLeaf Number represented as string
 * @param {string} issuer Hex string
 * @param {number} countryCode
 * @param {string} subdivision UTF-8
 * @param {string} completedAt Hex string representing 3 bytes
 * @param {string} birthdate Hex string representing 3 bytes
 * @param {string} oldSecret Hex string representing 16 bytes
 * @param {string} newSecret Hex string representing 16 bytes
 */
export async function onAddLeafProof(
  signedLeaf,
  newLeaf,
  issuer,
  countryCode,
  subdivision,
  completedAt,
  birthdate,
  oldSecret,
  newSecret
) {
  if (!zokProvider) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // TODO: Make this more sophisticated. Wait for zokProvider to be set or for timeout (e.g., 10s)
    await sleep(5000);
  }
  const args = [
    ethers.BigNumber.from(signedLeaf).toString(),
    ethers.BigNumber.from(newLeaf).toString(),
    ethers.BigNumber.from(issuer).toString(),
    ethers.BigNumber.from(countryCode).toString(),
    ethers.BigNumber.from(new TextEncoder("utf-8").encode(subdivision)).toString(),
    ethers.BigNumber.from(completedAt).toString(),
    ethers.BigNumber.from(birthdate).toString(),
    ethers.BigNumber.from(oldSecret).toString(),
    ethers.BigNumber.from(newSecret).toString(),
  ];
  try {
    const { witness, output } = zokProvider.computeWitness(onAddLeafArtifacts, args);
    const pk = new Uint8Array(onAddLeafProvingKey.data);
    const proof = zokProvider.generateProof(onAddLeafArtifacts.program, witness, pk);
    return proof;
  } catch (err) {
    console.log(err);
  }
}

async function testOnAddLeafProof() {
  const issuer = "0x0000000000000000000000000000000000000000";
  const countryCode = 2;
  const subdivision = "NY";
  const completedAt = "0x123456";
  const birthdate = "0x123456";

  // get signedLeaf
  const oldSecret = "0x00000000000000000000000000000000";
  const signedLeaf = await createLeaf(
    issuer,
    oldSecret,
    countryCode,
    subdivision,
    completedAt,
    birthdate
  );
  // get newLeaf
  const newSecret = "0x10000000000000000000000000000000";
  const newLeaf = await createLeaf(
    issuer,
    newSecret,
    countryCode,
    subdivision,
    completedAt,
    birthdate
  );

  console.log("generating proof...");
  const proof = await onAddLeafProof(
    signedLeaf,
    newLeaf,
    issuer,
    countryCode,
    subdivision,
    completedAt,
    birthdate,
    oldSecret,
    newSecret
  );
  console.log("proof...");
  console.log(proof);
  return proof;
}
testOnAddLeafProof();
