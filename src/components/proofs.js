import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useSignMessage } from "wagmi";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import {
  requestProof
} from "../utils/secrets";
import { zkIdVerifyEndpoint } from '../constants/api';

const Proofs = () => {
  const params = useParams();
  const [requestedProofs, setRequestedProofs] = useState();

  useEffect(() => {
    if (requestedProofs) return;
    const proofType = params.proofType;
    setRequestedProofs(true);

    // Special case: Lobby3. Requires 2 proofs
    if (proofType === 'lobby3') {
      requestProof('addSmallLeaf-country').then((proof) => {
        // TODO: Call smart contract
      }).then(() => requestProof('PoKoPoML-country')).then((proof) => {
        // TODO: Call smart contract
      })
    } else {
      requestProof(proofType).then((proof) => {
        // TODO: Call smart contract
      })
    }
  }, [])

  return (
    <>
      <div>
        <h3 style={{ textAlign: "center" }}>Generate Proof</h3>
        <div style={{ maxWidth: "600px", fontSize: "16px" }}>
        {params.proofType === 'lobby3' && (
          <div>
            <p>For Lobby3 Proof of Residence, you need to generate 2 proofs</p>
            <ol>
              <li>addSmallLeaf-country</li>
              <li>PoKoPoML-country</li>
            </ol>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Proofs;
