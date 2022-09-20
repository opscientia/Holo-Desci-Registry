import { ethers } from "ethers";
import { initialize } from "zokrates-js";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import lobby3ProvingKey from "./lobby3Proof.proving.key.json";
import onAddLeafProvingKey from "./onAddLeaf.proving.key.json";

const poseidonCodeQuinary = `import "hashes/poseidon/poseidon" as poseidon;
def main(field n1, field n2, field n3, field n4, field n5) -> field {
    return poseidon([n1, n2, n3, n4, n5]);
}`;
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
let poseidonQuinaryArtifacts;
let createLeafArtifacts;
let lobby3ProofArtifacts;
let onAddLeafArtifacts;
initialize().then((zokratesProvider) => {
  zokProvider = zokratesProvider;
  poseidonQuinaryArtifacts = zokProvider.compile(poseidonCodeQuinary);
  createLeafArtifacts = zokProvider.compile(createLeafCode);
  lobby3ProofArtifacts = zokProvider.compile(lobby3ProofCode);
  onAddLeafArtifacts = zokProvider.compile(onAddLeaf);
});

/**
 * (Forked from holo-merkle-utils)
 * Serializes createProof outputs to ZoKrates format
 */
function serializeProof(proof, hash) {
  // Insert the digest of the leaf at every level:
  let digest = proof.leaf;
  for (let i = 0; i < proof.siblings.length; i++) {
    proof.siblings[i].splice(proof.pathIndices[i], 0, digest);
    digest = hash(proof.siblings[i]);
  }

  // serialize
  const argify = (x) => ethers.BigNumber.from(x).toString();
  const args = [
    argify(proof.root),
    argify(proof.leaf),
    proof.siblings.map((x) => x.map((y) => argify(y))),
    proof.pathIndices.map((x) => argify(x)),
  ];
  return args;
}

/**
 * @param {Array<string>} input Array of numbers represented as strings.
 * @returns {string}
 */
export function poseidonHashQuinary(input) {
  if (input.length !== 5 || !Array.isArray(input)) {
    throw new Error("input must be an array of length 5");
  }
  if (!zokProvider) {
    throw new Error("zokProvider has not been initialized");
  }
  const { witness, output } = zokProvider.computeWitness(
    poseidonQuinaryArtifacts,
    input
  );
  return output.replaceAll('"', "");
}

/**
 * @param {string} issuer Hex string
 * @param {string} secret Hex string representing 16 bytes
 * @param {number} countryCode
 * @param {string} subdivision UTF-8
 * @param {string} completedAt Hex string representing 3 bytes
 * @param {string} birthdate Hex string representing 3 bytes
 * @returns {string}
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
    root,
    leaf,
    path,
    indices,
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
  const { witness, output } = zokProvider.computeWitness(onAddLeafArtifacts, args);
  const pk = new Uint8Array(onAddLeafProvingKey.data);
  const proof = zokProvider.generateProof(onAddLeafArtifacts.program, witness, pk);
  return proof;
}

/**
 * ---------------------------------------------------------------------------------
 * BEGIN test functions
 * ---------------------------------------------------------------------------------
 */

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

async function testPoseidonHashQuinary() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await sleep(3000);
  const input = ["0", "0", "0", "0", "0"];
  const hash = poseidonHashQuinary(input);
  console.log(hash);
}

async function testPoseidonHashQuinaryWithMerkleTree() {
  console.log("testPoseidonHashQuinaryWithMerkleTree");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  await sleep(5000);
  const leavesFromContract = []; // TODO: Get leaves from merkle tree smart contract
  const leaves = [...leavesFromContract, "1"];
  const tree = new IncrementalMerkleTree(poseidonHashQuinary, 14, "0", 5);
  for (const leaf of leaves) {
    tree.insert(leaf);
  }
  const index = tree.indexOf("1");
  const merkleProof = tree.createProof(index);
  console.log("merkleProof...");
  console.log(merkleProof);
  const serializedMerkleProof = serializeProof(merkleProof, poseidonHashQuinary);
  console.log("serializedMerkleProof");
  console.log(serializedMerkleProof);
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

async function testLobby3Proof() {
  console.log("testLobby3Proof");
  const issuer = "0x0000000000000000000000000000000000000000";
  const countryCode = 2;
  const subdivision = "NY";
  const completedAt = "0x123456";
  const birthdate = "0x123456";

  const secret = "0x00000000000000000000000000000000";
  const leaf = await createLeaf(
    issuer,
    secret,
    countryCode,
    subdivision,
    completedAt,
    birthdate
  );

  const leavesFromContract = []; // TODO: Get leaves from merkle tree smart contract
  const leaves = [...leavesFromContract, leaf];
  const tree = new IncrementalMerkleTree(poseidonHashQuinary, 14, "0", 5);
  for (const item of leaves) {
    tree.insert(item);
  }
  const index = tree.indexOf(leaf);
  const merkleProof = tree.createProof(index);
  const serializedMerkleProof = serializeProof(merkleProof, poseidonHashQuinary);

  console.log("generating lobby3Proof...");
  const proof = await lobby3Proof(
    issuer,
    countryCode,
    subdivision,
    completedAt,
    birthdate,
    secret,
    // root,
    serializedMerkleProof[0],
    // leaf,
    serializedMerkleProof[1],
    // path,
    serializedMerkleProof[2],
    // indices
    serializedMerkleProof[3]
  );
  console.log("lobby3Proof...");
  console.log(proof);
  return proof;
}
