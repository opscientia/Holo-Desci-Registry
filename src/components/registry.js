import React, { useState, useEffect } from "react";
import SmallCard from "./atoms/SmallCard";
import { SearchBar } from "./search-bar.js";
import { Modal } from "./atoms/Modals.js";
import { useNavigate } from "react-router-dom";
import wtf from "../wtf-configured";
import { useAccount } from "wagmi";

// Wraps everything on the registry screen with style
const Wrapper = (props) => {
  return (
    <>
      <div class="slider-container" style={{ width: "100vw" }}>
        <div class="slider-wrapper">{props.children}</div>
      </div>
      <div class="spacer-small"></div>
    </>
  );
};

const defaultHolo = {
  name: "",
  bio: "",
  twitter: "",
  google: "",
  github: "",
  orcid: "",
};

let hasBeenRun = false;

const Registry = (props) => {
  const { data: account } = useAccount();
  const getAllAddresses = async () => {
    const response = await fetch(`https://sciverse.id/getAllUserAddresses`);
    let allAddresses = await response.json();
    return allAddresses;
  };

  // fetches holos one-by-one from addresses and appends them to holos live
  const setHolosAsyncFromAddresses = async (addresses) => {
    let tmpHolos = [];
    for (const address of addresses) {
      let holo_ = {};
      try {
        // Try getting holo from cache. If it fails, call chain directly.
        console.log(`Retrieving holo for address ${address}...`);
        const response = await fetch(`https://sciverse.id/getHolo?address=${address}`);
        holo_ = (await response.json())[props.desiredChain];
        console.log(`Retrieved holo for address ${address}...`);
        console.log(holo_);
      } catch (err) {
        wtf.setProviderURL({ gnosis: "https://xdai-rpc.gateway.pokt.network" });
        holo_ = (await wtf.getHolo(address))[props.desiredChain];
      }
      const newHolo = {
        ...defaultHolo,
        google: holo_.google,
        orcid: holo_.orcid,
        github: holo_.github,
        twitter: holo_.twitter,
        name: holo_.name || "Anonymous",
        bio: holo_.bio || "No information provided",
        address: address,
      };
      const holoIsEmpty = Object.values(newHolo).every((x) => !x);
      console.log("NEW HOLO", newHolo);
      console.log("abc");
      if (!holoIsEmpty) {
        tmpHolos.push(newHolo);
        // remove duplicates
        tmpHolos = [...new Set([...tmpHolos])];
        console.log("NEW SET", tmpHolos);
        setHolos(tmpHolos);
      }
    }
  };

  const init = async () => {
    if (!account || hasBeenRun) {
      return;
    }
    hasBeenRun = true;
    try {
      let addresses = await getAllAddresses();
      // Only show the modal if the user doesn't have a Holo:
      if (addresses.includes(account.address.toLowerCase())) {
        setModalVisible(false);
      }
      await setHolosAsyncFromAddresses(addresses);
      // setHolos(allHolos)
    } catch (err) {
      console.error("ERROR: ", err);
    }
  };
  const [holos, setHolos] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  useEffect(init, [account]);

  console.log(holos);

  const navigate = useNavigate();

  return (
    <>
      <div class="x-section bg-img wf-section" style={{ height: "200vw" }}>
        <div className="x-container w-container">
          <div className="x-wrapper fullscreen-center" style={{ marginLeft: "1.5vw", marginLeft: "1.5vw" }}>
            <h1>DeSci Community</h1>
            <div className="x-wrapper small-center">
              <SearchBar />
              <div class="spacer-large"></div>
            </div>
            <Wrapper>{holos.length ? holos.map((x) => <SmallCard holo={x} href={`/lookup/address/${x.address}`} />) : null}</Wrapper>
            <Modal visible={modalVisible} setVisible={() => {}} blur={true}>
              <h3 className="h3 white">Create your own identity to join the community</h3>
              <div className="x-container w-container" style={{ justifyContent: "space-between" }}>
                <a onClick={() => navigate("/myholo")} className="x-button" style={{ width: "45%" }}>
                  Create My ID
                </a>
                <a href="https://holo.pizza" className="x-button secondary" style={{ width: "45%" }}>
                  Learn More
                </a>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};
export default Registry;
