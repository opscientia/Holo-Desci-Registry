import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { storeCredentials, getIsHoloRegistered } from "../utils/secrets";
import { zkIdVerifyEndpoint } from '../constants/api';

const testCreds = {
  bigCredsSecret: "0x39c50479f506505ac61a4c027d9489d1",
  bigCredsSignature:
    "0xbaa4d3802f655c159fb810c1678f2f498f1b0cee835ab983135816cfd2e7b449209e86382db2e7014345a0731b74da694c7ccc0a48f36bab04272d8af53008ed1c",
  birthdate: "",
  birthdateSecret: "0x3ea47c99774b28650195094095674356",
  birthdateSignature:
    "0xb7192ed3b27e0a746e26cc4bd67a6b9f10e1c42a4274948a916c664b7b09e5ef21ba100d2ac96c53646bf1114cd4394a784206f7535d6d7e6bcf85271abc21501b",
  city: "",
  citySecret: "0x53387a2938c2e68e3f0b288df1a4e158",
  citySignature:
    "0xb8b1f97823ab2fffdb3b128c177d37531966d459342848bd56295fc792b477f01fb476ef7a2eed33293dc94e3445bc93e7596c909372276d0dde9b5227b323af1c",
  completedAt: "2022-08-19T16:43:08.000Z",
  completedAtSecret: "0xa9c767df8ce37b9ee93a8de5c345c0b4",
  completedAtSignature:
    "0x90826f603a409b7c3d8e315ab79dabdbf1f20f30d5d1ae6a7bcf72252b0903c468855637e930da55f8e0af831b832ab78d1ee6d91cef0b65a3f03e4c2437b0a91b",
  countryCode: "US",
  countryCodeSecret: "0xa7b063a76d69133bd60140c4f8e6a9c9",
  countryCodeSignature:
    "0x0fb5e166d127a1d07b2594ddeccad80d0439972e2832b328cb6d8ec724c434b22bb61d05ab872346bd8c38d3a6e88e1ec1ca3cc7adbf73c37674280686c17ffb1c",
  firstName: "",
  firstNameSecret: "0x21b4c98dbb9ac588170fec34275a9d6c",
  firstNameSignature:
    "0xd3fd3aef76684cc5fa077892e01a17c4ec45817c9f45cbfbb4d478b0191816841e3f36f60fa343e32537456a48525bb55905cd250575158d898b62b7c2aa568c1c",
  lastName: "",
  lastNameSecret: "0x02093892c8a92c615c462acbc9045974",
  lastNameSignature:
    "0x2080bb5f81d1402e20ec70a117d831a4d0dccc1cc977f92fda9be1045a5a60975a6c8ca886e6164cd73db10a4f81be3ff094e0893190b30d3deb4dfc74d63a391c",
  middleInitial: "",
  middleInitialSecret: "0x76d9f5a0e9d3d228820af55dd322ac0a",
  middleInitialSignature:
    "0xdd2b343ff3da3370c81ee4ff9c16f93e5770f38b8b69c4793f76977d58a9d4467a6727332007e9aa06ab99e58a5b919f678d38db76819677594eef4755b7796a1c",
  postalCode: "",
  postalCodeSecret: "0xb7234c6312a0d097574a83dceffb466f",
  postalCodeSignature:
    "0xd4bc00697126de5f5fe55d781129112218a990024516a14f68ad20837805aa5c630979b57988982dd227b549dd6045faa7f7683f6d76240d6665691b3aac54f11c",
  streetAddr1: "",
  streetAddr1Secret: "0xdd56cd2e7366637e57ebbec829cc606a",
  streetAddr1Signature:
    "0xeff5c5ffb0c6d91df362e0d42228c3d414c023128d89b369c8d2e3f3220802de1d52f2451fc1e0b6078495bf1fdc6e63bcc32c4bf74b4906bb6e67e0830b77d91c",
  streetAddr2: "",
  streetAddr2Secret: "0x1418307cc4cd15ecb876a33d1acb11f7",
  streetAddr2Signature:
    "0x507a7561db883ab20988d126447caa7cdfffcdde0d33f26d6727dd0c9497bcec72b75f7e8547fa965d45a2caad00e508b9c555377f24fc17474a8afbb19450631c",
  subdivision: "",
  subdivisionSecret: "0xfadce709103d67379ac17cd80cc983cc",
  subdivisionSignature:
    "0xf7764f5fd2af096a5b0472e8a4da871f6b7d356807c892f69e02ce1370f6807804326b158ba686a30b64e00346b3c57060ea328f2d1fb61764bf62c183ea45b61b",
};

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

  useEffect(() => {
  }, []);

  // For testing
  // storeCredentials(testCreds);

  return (
    <>
      {error ? (
        <p>{error}</p>
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
