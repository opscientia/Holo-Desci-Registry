import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SearchBar } from "./search-bar";
import { DisplayPOAPs } from "./poaps";
import Holo from "./atoms/Holo";
import { getHoloFromAddress, getHoloFromCredentials, searchHolos } from "../utils/holoSearch";

// import ToggleButton from 'react-bootstrap/ToggleButton'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import 'bootstrap/dist/css/bootstrap.css';

const { ethers } = require("ethers");

const sendCrypto = (provider, to) => {
  if (!provider || !to) {
    alert("Error: Please connect your wallet, set it to the right network, and specify a recipient");
  } else {
    provider.getSigner().sendTransaction({
      to: to,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(".1"),
    });
  }
};

// Wraps everything on the lookup screen with style
const Wrapper = (props) => {
  // return <div class="x-section bg-img wf-section" style={{width:'100vw', height:'100vh'}}>
  return (
    <div class="x-section bg-img wf-section">
      <div className="x-container w-container">
        <div className="x-wrapper small-center">{props.children}</div>
      </div>
    </div>
  );
};

//   MAKE SURE NETWORK IS SET TO THE RIGHT ONE (AVALANCHE C TESTNET)
export const Lookup = (props) => {
  const [holos, setHolos] = useState();
  let params = useParams();

  useEffect(() => {
    if (!params.web2service || !params.credentials) {
      return;
    }
    switch (params.web2service) {
      case "holosearch":
        searchHolos(params.credentials).then((holosTemp) => setHolos(holosTemp));
        break;
      case "address":
        getHoloFromAddress(params.credentials).then((holo) => setHolos([holo]));
        break;
      default:
        getHoloFromCredentials(params.credentials, params.web2service).then((holo) => setHolos([holo]));
    }
  }, [params.credentials, params.web2service]);

  // if the URL is just /lookup or something malformed, just return the search bar
  if (!params.web2service || !params.credentials) {
    return (
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SearchBar />
      <div class="spacer-large"></div>
      {!holos ? (
        <p>No users found</p>
      ) : holos.length === 1 ? ( // Display one Holo, with payment button and POAPs
        <>
          <Holo holo={holos[0]} />
          <div class="spacer-medium"></div>
          <div class="btn-wrapper">
            {/* TODO: Rewrite payment function using wagmi hooks
            {params.web2service != "address" ? (
              <a onClick={() => sendCrypto(props.provider, holos[0].address)} class="x-button primary">
                Pay {params.credentials}
              </a>
            ) : null} */}
          </div>
          <div>{/* <DisplayPOAPs address={holos[0].address} /> */}</div>
        </>
      ) : (
        // Display multiple holos, i.e., the result of an ambiguous search
        holos.map((userHolo) => (
          <div key={parseInt(userHolo.address, 16)}>
            <div class="spacer-small"></div>
            <Holo holo={userHolo} />
          </div>
        ))
      )}
    </Wrapper>
  );
};
