import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { storeCredentials, getIsHoloRegistered } from "../utils/secrets";
import { zkIdVerifyEndpoint } from "../constants/server";

const instructionStyles = {
  marginBottom: "10px",
  fontSize: "16px",
  fontFamily: "Montserrat, sans-serif",
  lineHeight: "1.5",
};

const testCreds = {
  bigCredsSecret: "0x4704a39e96c1753b525d8734a37685b8",
  bigCredsSignature:
    "0x07138e4c38e8d8541920a087641017f4d32dcf1d100e94db46d1fd67fa59edf23ab7514a2b9cdc613d7264485764e79aa01d243dfba0b87171675f5219aae7651c",
  birthdate: "",
  birthdateSecret: "0xea018caeef0868e40df71042674d9571",
  birthdateSignature:
    "0xfef878a2b56c2f2ee97f9bb8cf9044eb45d12ae31ed58df4516b0ec770865b612b3eef8cb3349eb1e5b20320254b72da0935f345942c86413d0d3652580308f11c",
  city: "",
  citySecret: "0xb7410acfa87e091899bb2520aaccb952",
  citySignature:
    "0xb6613dae0ccbc01df57630f4f2f1fc4a83a7d8f552f5cad0ab7e0799b245e3f334c30e9d2494744834f3616117505457c147c1681600235b846e1d25f7a748eb1b",
  completedAt: "2022-09-13T16:01:32.000Z",
  completedAtSecret: "0x5e1813edf42b12a189071dce66df7431",
  completedAtSignature:
    "0x75ee057a593ee8e344a59933a61a8b98d8eee71d8350cd98550e9b21ae9f0d5f08341755ade3c661d6230613074fab4f67089f4891ad8d610ff7d9dae09de37b1c",
  countryCode: 2,
  countryCodeSecret: "0xc9e8bd44fd3048d48dd998e2f4f942e2",
  countryCodeSignature:
    "0xe3675c60c9350a8f75c5f87bad7b0ebca7623111f8017ceafffd34f4e4cdbdee6c3b99cd89437f42f520461ae3c9d635ed79ff4b3ad3fc8337351e9a5de289e71b",
  firstName: "",
  firstNameSecret: "0xd628b62fb0211227eb67139428e7bb91",
  firstNameSignature:
    "0xde771f71e36234204956d455a5a24693981e08eeda8bb6ae6f3ac19884806e7e4cc60d30ce6c93a487128a63a52f01bc00514fdaf469dbfeddcf1a521caf577d1b",
  lastName: "",
  lastNameSecret: "0x341114169815216144907cde9d374782",
  lastNameSignature:
    "0x91fa8986ebbc5dd08f6c7b822d4e38615df3cfa21a1c82cd395edb79ae1a4b5c5e7f17654d37d40008ba795b3145b5d1d63a8fd88a95c5a8016de1ad114d7b111c",
  middleInitial: "",
  middleInitialSecret: "0x84b09e309bd234ab828eb13b99c632eb",
  middleInitialSignature:
    "0xe83c5a1b1a964dc1dff37bcf541b67e2edbb0ac792588c9147db1774d21cc0ba511095f24bb060a08983285eff7318ea9fc0f99a0807f06a6bd42819270bd4851b",
  postalCode: "",
  postalCodeSecret: "0x8c4c2120ab081a4f59c2a51ee58d7268",
  postalCodeSignature:
    "0x4f660493d8a876874ef224ccdbfcfc1d3cc9ff8aaf41d8cbd6ec3e70e69192342d54d6ef42eec09cf0929b4d2517bef5d1cc1205b27a827ce0f6b8dda6dfac7f1c",
  streetAddr1: "",
  streetAddr1Secret: "0x3a375984fdbf3005c5808b9d58ab6031",
  streetAddr1Signature:
    "0x4d941f55a8d1aa341f1759f640c3691d6730795d4a11d3cc41bcd1947b7713302fabdb635e8852d2574b282aa34241b90c6ce174f1eaf3c496810f441bc988211b",
  streetAddr2: "",
  streetAddr2Secret: "0x89d80c3f71379209efe92ddbb7afd5f9",
  streetAddr2Signature:
    "0x085669ce798f48a19b54e2220959449dd174b066d669864a27a8a911719bf9103cf19ba9c962f2c65efc34fb74ec575debeb30e958767da925f49da49cc26f231b",
  subdivision: "",
  subdivisionSecret: "0xb5f9f06ee5efb1b21b84b091b0ad6a5d",
  subdivisionSignature:
    "0x72ca188237c4e3f6c3e22f17fed7f3851706ffdbc295c978b2dd40f7955c21dc32a1502430e24da8bea790925d0b2edfbd200637de8d540b5970b0a4323918931c",
};

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [registered, setRegistered] = useState(false);
  const [creds, setCreds] = useState();

  async function getCredentials() {
    if (!localStorage.getItem("holoTempSecret")) {
      return;
    }
    setError(undefined);
    setLoading(true);
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
        setLoading(false);
        const credsTemp = data.user;
        setCreds(credsTemp);
        localStorage.removeItem("holoTempSecret");
        return credsTemp;
      }
    } catch (err) {
      console.log(err);
      setError(`Error: ${err.message}`);
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function waitForUserRegister() {
    let isRegistered = await getIsHoloRegistered();
    while (!isRegistered) {
      await sleep(100);
      isRegistered = await getIsHoloRegistered();
    }
  }

  useEffect(() => {
    // For testing
    // storeCredentials(testCreds);

    async function func() {
      const isRegistered = await getIsHoloRegistered();
      // Only setRegistered at this first check. If user had not registered before
      // reaching this page, we want to keep on the page the instructions for the
      // non-registered user
      setRegistered(isRegistered);
      if (!isRegistered) {
        await waitForUserRegister();
        setError(undefined);
      }
      const credsTemp = await getCredentials();
      await storeCredentials(credsTemp);
    }
    try {
      func();
    } catch (err) {
      console.log(err);
      setError(`Error: ${err.message}`);
    }
  }, []);

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : loading ? (
        <h3 style={{ textAlign: "center" }}>Loading...</h3>
      ) : (
        <div>
          <h3 style={{ textAlign: "center" }}>Almost finished!</h3>
          <br />
          <div style={{ maxWidth: "600px", fontSize: "16px" }}>
            <i>
              <ol>
                {!registered && (
                  <li>
                    <p>
                      Open the Holonym extension, and create an account by entering a
                      password (be sure to remember it)
                    </p>
                  </li>
                )}
                <li>
                  <p>
                    Login to the Holonym popup{" "}
                    {!registered && "(after creating an account)"}
                  </p>
                </li>
                <p>
                  <li>Confirm your credentials</li>
                </p>
              </ol>
            </i>
            <br />
            <h4>The Holonym extension will then store your encrypted credentials.</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default Verified;
