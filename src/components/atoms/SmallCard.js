import React from "react";
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

export default function SmallCard(props) {
  return (
    <div className="x-card" style={{ minHeight: "100%" }}>
      <a href={props.href} style={{ textDecoration: "none" }}>
        <div className="id-card profile">
          <div className="id-card-1">
            <img src={profile} loading="lazy" alt="" className="id-img" />
          </div>
          <div className="id-card-2">
            <div className="id-profile-name-div">
              <h3 id="w-node-_0efb49bf-473f-0fcd-ca4f-da5c9faeac9a-4077819e" className="h3 no-margin">
                {props.holo.name}
              </h3>
            </div>
            <div className="spacer-xx-small"></div>
            <p className="id-designation">{props.holo.bio}</p>
          </div>
        </div>
        {Object.keys(props.holo).map((k) => {
          if (props.holo[k] && k != "name" && k != "bio" && k != "address") {
            return (
              <a href={linkFor(k, props.holo[k])}>
                <img src={icons[k]} style={{ paddingLeft: "30px" }} loading="lazy" alt="" className="card-logo" />
              </a>
            );
          }
        })}
      </a>
    </div>
  );
}
