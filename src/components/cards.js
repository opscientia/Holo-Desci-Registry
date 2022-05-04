import React, { useState, useEffect } from 'react'

// this should perhaps be in its own file
import Github from '../img/Github.svg';
import Google from '../img/Google.svg';
import CircleWavy from '../img/CircleWavy.svg';
import CircleWavyCheck from '../img/CircleWavyCheck.svg';
import Orcid from '../img/Orcid.svg';
import TwitterLogo from '../img/TwitterLogo.svg';
import profile from '../img/profile.svg';
import { linkFor } from '../link-for.js';
const icons = {
    google : Google,
    github : Github,
    orcid : Orcid,
    twitter : TwitterLogo

}

export const BigCard = (props) => {
return <div className="x-card">
        <div className="id-card profile">
        <div className="id-card-1"><img src={profile} loading="lazy" alt="" className="id-img" /></div>
        <div className="id-card-2">
            <div className="id-profile-name-div">
            <h3 id="w-node-_0efb49bf-473f-0fcd-ca4f-da5c9faeac9a-4077819e" className="h3 no-margin">{props.holo.name}</h3>
            </div>
            <div className="spacer-xx-small"></div>
            <p className="id-designation">{props.holo.bio}</p>
        </div>
        </div>
        <div className="spacer-small"></div>
        <div className="spacer-small"></div>
        {Object.keys(props.holo).map(k => {
            if(k != 'name' && k != 'bio') {
                return <>
                    <div className="card-text-div"><img src={icons[k]} loading="lazy" alt="" className="card-logo" />
                        <div className="card-text">{props.holo[k] || 'Not listed'}</div>
                        <img src={props.holo[k] ? CircleWavyCheck : CircleWavy} loading="lazy" alt="" className="id-verification-icon" />
                    </div>
                    <div className="spacer-x-small"></div>
                </>
            }
        })}
    </div>
}


export const SmallCard = (props) => {
    return <div className="x-card" style={{minHeight:'100%'}}>
            <a href={props.href} style={{textDecoration: 'none'}}>
                <div className="id-card profile">
                <div className="id-card-1"><img src={profile} loading="lazy" alt="" className="id-img" /></div>
                <div className="id-card-2">
                    <div className="id-profile-name-div">
                    <h3 id="w-node-_0efb49bf-473f-0fcd-ca4f-da5c9faeac9a-4077819e" className="h3 no-margin">{props.holo.name}</h3>
                    </div>
                    <div className="spacer-xx-small"></div>
                    <p className="id-designation">{props.holo.bio}</p>
                </div>
                </div>
                {Object.keys(props.holo).map(k => {
                    if(props.holo[k] && (k != 'name') && (k != 'bio') && (k != 'address')) {
                        return <a href={linkFor(k, props.holo[k])}>
                                    <img src={icons[k]} style={{paddingLeft:'30px'}}loading="lazy" alt="" className="card-logo" />
                                </a>
                    }
                })}
            </a>
        </div>
    }