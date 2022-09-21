import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { requestCredentials } from "../utils/secrets";
import {
  getStateAsHexString,
  getDateAsHexString,
  serializeProof,
  poseidonHashQuinary,
  createLeaf,
  onAddLeafProof,
  lobby3Proof,
} from "../utils/proofs";
import { serverAddress } from "../constants/misc";

const Proofs = () => {
  const params = useParams();
  const [credentials, setCredentials] = useState();
  const [error, setError] = useState();

  async function handleLobby3Proofs() {
    console.log("requesting credentials...");
    const creds = await requestCredentials();
    setCredentials(creds);
    if (!creds) {
      setError(
        "Could not retrieve credentials for proof. Please make sure you have the Holonym extension installed."
      );
    }
    console.log("credentials...");
    console.log(creds);

    const subdivision = getStateAsHexString(creds.subdivision);
    const completedAt = getDateAsHexString(creds.completedAt);
    const birthdate = getDateAsHexString(creds.completedAt);

    // onAddLeafProof
    // TODO: GENERATE NEW SECRET WITHIN EXTENSION AND THEN SEND IT WITH THE REST OF CREDS
    const oldSecret = creds.secret;
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const newSecret = ethers.BigNumber.from(array).toHexString();
    const oalProof = await onAddLeafProof(
      serverAddress,
      creds.countryCode,
      subdivision,
      completedAt,
      birthdate,
      oldSecret,
      newSecret
    );
    console.log("oalProof");
    console.log(oalProof);

    // lobby3Proof
    const leaf = await createLeaf(
      serverAddress,
      newSecret,
      creds.countryCode,
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
    const lob3Proof = await lobby3Proof(
      serverAddress,
      creds.countryCode,
      subdivision,
      completedAt,
      birthdate,
      newSecret,
      // root,
      serializedMerkleProof[0],
      // leaf,
      serializedMerkleProof[1],
      // path,
      serializedMerkleProof[2],
      // indices
      serializedMerkleProof[3]
    );
    console.log("lob3Proof");
    console.log(lob3Proof);
    // TODO: Call smart contracts
    // contract.updateLeaf(oalProof)
    // contract.proveResidence(lob3Proof)
  }

  useEffect(() => {
    console.log("entered useEffect");
    if (credentials) return;
    const proofType = params.proofType;
    console.log(`proofType: ${proofType}`);
    if (proofType === "lobby3") {
      handleLobby3Proofs();
    }
  }, []);

  return (
    <>
      <div>
        <h3 style={{ textAlign: "center" }}>Generate Proofs</h3>
        <div style={{ maxWidth: "600px", fontSize: "16px" }}>
          <div>
            {error ? (
              <p>Error: {error}</p>
            ) : (
              <p>
                When you see the Holonym popup, please confirm that you would like to
                share your credentials with this web page
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Proofs;
