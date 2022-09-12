import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { 
  storeCredentials,
  getIsHoloRegistered,
} from "../utils/secrets";
import { zkIdVerifyEndpoint } from '../constants/api';

const instructionStyles = { 
  marginBottom: '10px',
  fontSize: "16px", 
  fontFamily: "Montserrat, sans-serif", 
  lineHeight: "1.5" 
}

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();
  const [registered, setRegistered] = useState(false);
  const [creds, setCreds] = useState();

  async function getCredentials() {
    if (!localStorage.getItem("holoTempSecret")) {
      return;
    }
    setError(undefined);
    try {
      const secret = localStorage.getItem("holoTempSecret");
      const resp = await fetch(
        `${zkIdVerifyEndpoint}/register/credentials?secret=${secret}`
      );
      // Shape of data == { user: completeUser }
      const data = await resp.json();
      if (data.error) {
        setError(data.error);
      } else {
        const credsTemp = data.user;
        setCreds(credsTemp)
        localStorage.removeItem("holoTempSecret");
        return credsTemp;
      }
    } catch (err) {
      console.log(err);
      setError(`Error: ${err.message}`);
    }
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function waitForUserRegister() {
    let isRegistered = await getIsHoloRegistered()
    while (!isRegistered) {
      await sleep(100)
      isRegistered = await getIsHoloRegistered()
    }
  }

  useEffect(() => {
    async function func() {
      const isRegistered = await getIsHoloRegistered()
      // Only setRegistered at this first check. If user had not registered before 
      // reaching this page, we want to keep on the page the instructions for the 
      // non-registered user
      setRegistered(isRegistered)
      if (!isRegistered) {
        await waitForUserRegister()
        setError(undefined)
      }
      const credsTemp = await getCredentials();
      await storeCredentials(credsTemp);
    }
    try {
      func()
    }
    catch (err) {
      console.log(err);
      setError(`Error: ${err.message}`);
    }
  }, []);

  // For testing
  // useEffect(() => {
  //   setCreds({ countryCode: 2, countryCodeSecret: "0x" + "11".repeat(16) })
  // }, []);

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3 style={{ textAlign: "center" }}>Almost finished!</h3>
          <div style={{ maxWidth: "600px", fontSize: "16px" }}>
            <p style={instructionStyles}>Final steps:</p>
            <ol>
              {!registered && (
                <li style={instructionStyles}>
                  Open the Holonym extension, and create an account by entering a
                  password (be sure to remember it)
                </li>
              )}
              <li style={instructionStyles}>
                Login to the Holonym popup{" "}
                {!registered && "(after creating an account)"}
              </li>
              <li style={instructionStyles}>Confirm your credentials</li>
            </ol>
            <p>The Holonym extension will then store your encrypted credentials.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Verified;
