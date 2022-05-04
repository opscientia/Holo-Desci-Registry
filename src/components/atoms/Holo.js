import React from "react";
import CircleWavy from "../../img/CircleWavy.svg";
import CircleWavyCheck from "../../img/CircleWavyCheck.svg";
import Github from "../../img/Github.svg";
import Google from "../../img/Google.svg";
import Orcid from "../../img/Orcid.svg";
import TwitterLogo from "../../img/TwitterLogo.svg";
import profile from "../../img/profile.svg";
import { linkFor } from "../../utils/link-for.js";

const icons = {
  google: Google,
  github: Github,
  orcid: Orcid,
  twitter: TwitterLogo,
};
// const defaultHolo = {
//   address: "",
//   name: "Anonymous",
//   bio: "No information provided",
//   twitter: "",
//   google: "",
//   github: "",
//   orcid: "",
// };

const Holo = (props) => {
  return (
    <div class="x-card">
      <div class="id-card profile">
        <div class="id-card-1">
          <img src={profile} loading="lazy" alt="" class="id-img" />
        </div>
        <div class="id-card-2">
          <div class="id-profile-name-div">
            <h3 id="w-node-_0efb49bf-473f-0fcd-ca4f-da5c9faeac9a-4077819e" class="h3 no-margin">
              {props.holo.name}
            </h3>
          </div>
          <div class="spacer-xx-small"></div>
          <p class="id-designation">{props.holo.bio}</p>
        </div>
      </div>
      <div class="spacer-small"></div>
      {/* <div class="card-heading">
      <h3 class="h3 no-margin">Profile Strength</h3>
      <div class="v-spacer-small"></div>
      <h3 class="h3 no-margin active">Pro</h3>
      <InfoButton text='Profile Strength is stronger the more accounts you have, the more recently you link the accounts, and greater your social activity metrics (e.g., number of friends, followers, repositories, etc.)' />
    </div> */}
      <div class="spacer-small"></div>
      {Object.keys(props.holo).map((k) => {
        if (!["name", "bio", "address", "discord"].includes(k)) {
          //ignore discord too for now
          return (
            <>
              <a style={{ textDecoration: "none" }} href={linkFor(k, props.holo[k])}>
                <div class="card-text-div">
                  <img src={icons[k]} loading="lazy" alt="" class="card-logo" />
                  <div class="card-text">{props.holo[k] || "Not listed"}</div>
                  <a>
                    <img src={props.holo[k] ? CircleWavyCheck : CircleWavy} loading="lazy" alt="" class="id-verification-icon" />
                  </a>
                </div>
              </a>
              <div class="spacer-x-small"></div>
            </>
          );
        }
      })}
    </div>
  );
};

export default Holo;
