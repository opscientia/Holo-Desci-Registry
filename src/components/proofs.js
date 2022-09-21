import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { requestCredentials } from "../utils/secrets";
import {
  serializeProof,
  poseidonHashQuinary,
  createLeaf,
  onAddLeafProof,
  lobby3Proof,
} from "../utils/proofs";
import { serverAddress } from "../constants/server";

const Proofs = () => {
  const params = useParams();
  const [credentials, setCredentials] = useState();

  async function handleLobby3Proofs() {
    const creds = await requestCredentials();
    setCredentials(creds);

    // onAddLeafProof
    // TODO: GENERATE NEW SECRET WITHIN EXTENSION AND THEN SEND IT WITH THE REST OF CREDS
    const oldSecret = creds.secret;
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const newSecret = ethers.BigNumber.from(array).toHexString();
    const oalProof = await onAddLeafProof(
      serverAddress,
      creds.countryCode,
      creds.subdivision,
      creds.completedAt,
      creds.birthdate,
      oldSecret,
      newSecret
    );

    // lobby3Proof
    const leaf = await createLeaf(
      serverAddress,
      newSecret,
      creds.countryCode,
      creds.subdivision,
      creds.completedAt,
      creds.birthdate
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
      creds.subdivision,
      creds.completedAt,
      creds.birthdate,
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
    // TODO: Call smart contracts
    // contract.updateLeaf(oalProof)
    // contract.proveResidence(lob3Proof)
  }

  useEffect(() => {
    if (credentials) return;
    const proofType = params.proofType;
    if (proofType === "lobby3") {
      handleLobby3Proofs();
    }
  }, []);

  return (
    <>
      <div>
        <h3 style={{ textAlign: "center" }}>Generate Proof(s)</h3>
        <div style={{ maxWidth: "600px", fontSize: "16px" }}>
          {!credentials && (
            <div>
              <p>
                When you see the Holonym popup, please confirm that you would like to
                share your credentials with this web page
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Proofs;
