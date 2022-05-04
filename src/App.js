import './App.css';
import './holo-wtf.webflow.css';
import './normalize.css';
import './webflow.css';
import AuthenticationFlow from './components/authentication-flow.js'
import Registry from './components/registry.js'
import { HomeLogo } from './components/logo.js';
import { Lookup } from './components/lookup.js';
import React, { useEffect, useRef, useState } from 'react';
// import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
// import FacebookLogin from 'react-facebook-login';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WebFont from 'webfontloader';
import chainParams from './chainParams.json'
import Address from './components/address.js'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import wtf from 'wtf-lib'

const { ethers } = require('ethers');

const desiredChain = 'gnosis'

try{
  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [chainParams[desiredChain]]
  })
} catch(e) {
  console.log('error was', e)
}


let walletIsConnecting = false
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const initMetamaskOnNetwork = async (desiredChainID) => {
//   let onCorrectNetwork = false; let provider = null; let signer = null;
//   let provider = window.ethereum;
//   if(window.ethereum) {
//     let signer = provider.getSigner();
//     let currId = await provider.request({method: 'eth_chainId'});
//     if (currId == desiredChainID){
//       return [provider, signer, {'onDesiredChain' : true}]
//     } else {
//       try {
//         await provider.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: desiredChainID }],
//         });
//       } catch (err) {
//         // If chain wasn't added in metamask 
//         if (switchError.code === 4902) {
//           add
//         }
//         return [provider, signer, err]
//       }
//     }
//     return 
//   } else {
//     metamaskConnected = false
//   }
// }





// // const addAvaxToMetamask = () => {
// //   // https://docs.avax.network/build/tutorials/smart-contracts/add-avalanche-to-metamask-programmatically
// //   const AVALANCHE_MAINNET_PARAMS = {
// //     chainId: '0xA86A',
// //     chainName: 'Avalanche Mainnet C-Chain',
// //     nativeCurrency: {
// //         name: 'Avalanche',
// //         symbol: 'AVAX',
// //         decimals: 18
// //     },
// //     rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
// //     blockExplorerUrls: ['https://snowtrace.io/']
// // }

// // const AVALANCHE_TESTNET_PARAMS = {
// //   chainId: '0xA869',
// //   chainName: 'Avalanche Testnet C-Chain',
// //   nativeCurrency: {
// //       name: 'Avalanche',
// //       symbol: 'AVAX',
// //       decimals: 18
// //   },
// //   rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
// //   blockExplorerUrls: ['https://testnet.snowtrace.io/']
// // }

// // function addAvalancheNetwork() {
// //   injected.getProvider().then(provider => {
// //     provider
// //       .request({
// //         method: 'wallet_addEthereumChain',
// //         params: [AVALANCHE_TESTNET_PARAMS]
// //       })
// //       .catch((error: any) => {
// //         console.log(error)
// //       })
// //   })
// // }
// // addAvalancheNetwork()
// // }

// // addAvaxToMetamask()




// These should be in their own file for modularity:
// returns idxStart, idxEnd
const searchSubtextInText = (subtext, text) => {
  let start = text.indexOf(subtext)
  return start, start + subtext.length
}

// const apiRequest = (authCode)=>{
//   var url = "https://orcid.org/oauth/token";
  
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url);

//     xhr.setRequestHeader("Accept", "application/json");
//     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

//     xhr.onreadystatechange = function () {
//         console.log('something happened')
//       if (xhr.readyState === 4) {
//           console.log(xhr.status);
//           console.log(xhr.responseText);
//       }};

//     var data = "client_id=APP-MPLI0FQRUVFEKMYX&client_secret=0c2470a1-ab05-457a-930c-487188e658e2&grant_type=authorization_code&redirect_uri=https://developers.google.com/oauthplayground&code=" + authCode;
//     xhr.send(data);
// }

function App() {
  // apiRequest(2000);
  
  // const orig = 'access_token=117a16aa-f766-4079-ba50-faaf0a09c864&token_type=bearer&expires_in=599&tokenVersion=1&persistent=true&id_token=eyJraWQiOiJwcm9kdWN0aW9uLW9yY2lkLW9yZy03aGRtZHN3YXJvc2czZ2p1am84YWd3dGF6Z2twMW9qcyIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiX1RCT2VPZ2VZNzBPVnBHRWNDTi0zUSIsImF1ZCI6IkFQUC1NUExJMEZRUlVWRkVLTVlYIiwic3ViIjoiMDAwMC0wMDAyLTIzMDgtOTUxNyIsImF1dGhfdGltZSI6MTY0NDgzMDE5MSwiaXNzIjoiaHR0cHM6XC9cL29yY2lkLm9yZyIsImV4cCI6MTY0NDkxODUzNywiZ2l2ZW5fbmFtZSI6Ik5hbmFrIE5paGFsIiwiaWF0IjoxNjQ0ODMyMTM3LCJmYW1pbHlfbmFtZSI6IktoYWxzYSIsImp0aSI6IjcxM2RjMGZiLTMwZTAtNDM0Mi05ODFjLTNlYjJiMTRiODM0OCJ9.VXNSFbSJSdOiX7n-hWB6Vh30L1IkOLiNs2hBTuUDZ4oDB-cL6AJ8QjX7wj9Nj_lGcq1kjIfFLhowo8Jy_mzMGIFU8KTZvinSA-A-tJkXOUEvjUNjd0OfQJnVVJ63wvp9gSEj419HZ13Lc2ci9CRY7efQCYeelvQOQvpdrZsRLiQ_XndeDw2hDLAmI7YrYrLMy1zQY9rD4uAlBa56RVD7me6t47jEOOJJMAs3PC8UZ6pYyNc0zAjQ8Vapqz7gxeCN-iya91YI1AIE8Ut19hGgVRa9N7l-aUielPAlzss0Qbeyvl0KTRuZWnLUSrOz8y9oGxVBCUmStEOrVrAhmkMS8A&tokenId=254337461'

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic']
      }
    });
   }, []);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(provider ? provider.getSigner() : provider);
  const [onRightChain, setOnRightChain] = useState(true);
  
  // Add right network to metamask
  const addChain = (chainName, provider) => {
    // make sure provider exists and has request method
    if(!provider || !provider.request || !provider.provider.request){return}
    console.log('PROVIDER', provider)
    provider.request({
            method: "wallet_addEthereumChain",
            params: [chainParams[chainName]]
          }
        )
      
  }

  // Get metamask on the right network
  const switchToChain = (chainName) => {
     // make sure provider exists and has request method
     if(!provider){return}
     // find request function regardless of whether provider is nested in another provider wrapper: (i imagine this has general use-case so should be its own function)
     let request;
     if (provider.request) {
       request = provider.request
    } else if (provider.provider && provider.provider.request) {
      request = provider.provider.request
    }
    if(!request){return}
   
    try {
      request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId : chainParams[chainName].chainId}]
      })
    } catch(e) {
      console.log(e)
      addChain(desiredChain, provider)
    }
    
  }
    
  const networkChanged = (network) => {
    console.log('network changed')
    if(Number(network) == Number(chainParams[desiredChain].chainId)){ //number converts between hex and int
      setOnRightChain(true)
    } else {
      setOnRightChain(false)
      try{addChain(desiredChain, provider); switchToChain(desiredChain, provider)}catch{}
    }
  }

  const signerChanged = async () => {
    if(!provider){return}
    console.log('SIGNER WAS CHANGED', provider, signer)
    let address;
    try {
      console.log('signer is ', signer)
      address = await signer.getAddress();
      console.log('address is', address)
      setAccount(address);
      // get the signed-in user's Holo:
      console.log('hey')
      console.log('GET ALL ACCOUNTS', await wtf.getAllAccounts(address, 'gnosis'));
    }
    catch (err) {
      console.log('need to login to metamask')
    }
    // also set the network correctly:
    try {
      let currentChainId = await provider.request({method: 'eth_chainId'})
      console.log('CURRENT CHAIN ID IS ', currentChainId)
      networkChanged(currentChainId)
    } catch (err) {
      console.log(provider, err)
    }
    
    
  }

  // lookup page doesn't need login (this is a weak check of the path but an exact check of the path doesn't matter that much)
  const needsLogin = !window.location.href.includes('/lookup')

  useEffect(()=>{console.log('PROVIDER IS', provider); addChain(desiredChain, provider); switchToChain(desiredChain, provider)}, [provider]);
  useEffect(signerChanged, [signer]);
  useEffect(signerChanged, []); //also update initially when the page loads

  const connectWallet = async () => {
    try {
      // set walletConnect options
      let wcOptions = {rpc:{}}
      wcOptions.rpc[chainParams[desiredChain].chainId] = chainParams[desiredChain].rpcUrls[0]

      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: wcOptions,
          chainId: 1
        }
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
      const provider_ = new ethers.providers.Web3Provider(await web3Modal.connect());
      setProvider(provider_);
      setSigner(provider_.getSigner());
      
    } catch (error) {
      console.error(error);
    }
  };  

  if(!provider && needsLogin){
    console.log('provider isn\'t')
    connectWallet()
  } else {
    console.log('provider is', provider)
    addChain(desiredChain, provider)
    switchToChain(desiredChain, provider)
  }

  if (!onRightChain){
    return 'Please make sure metamask is installed and switched to Polygon Mumbai Testnet'
  }

  // const LoginButton = () => {
  //   const { loginWithRedirect } = useAuth0();

  //   return <button onClick={() => loginWithRedirect()}>Log In</button>;
  // };

  return (
    // <Auth0Provider 
    //   domain='localhost:3000'
    //   clientId='vDweibbnTY1aIV78RBJXGseIiD95sSFj'
    //   redirectUri={window.location.origin}>
      <div className='App x-section wf-section'>
      <div className='x-container nav w-container'>
      <HomeLogo />
              {account ? <Address address={account} provider={provider} /> : <button class='connect-wallet x-button secondary outline-menu w-button' onClick={connectWallet}>Connect Wallet</button>
          }
      </div>
          <Router>
            <Routes>
              <Route path='/orcid/token/*' element={<AuthenticationFlow 
                                                  provider={provider}
                                                  account={account} 
                                                  connectWalletFunction={connectWallet}
                                                  token={window.location.href.split('/token/#')[1]/*It is safe to assume that the 1st item of the split is the token -- if not, nothing bad happens; the token will be rejected. 
                                                                                                    You may also be asking why we can't just get the token from the URL params. React router doesn't allow # in the URL params, so we have to do it manually*/}
                                                  credentialClaim={'sub'} 
                                                  web2service={'ORCID'}
                                                  desiredChain={desiredChain} />} /> 
              {/*Google has a different syntax and redirect pattern than ORCID*/}
              <Route path='/google/token/:token' element={<AuthenticationFlow
                                                  provider={provider} 
                                                  account={account} 
                                                  connectWalletFunction={connectWallet}
                                                  credentialClaim={'email'}
                                                  web2service={'Google'}
                                                  desiredChain={desiredChain} />} /> 

               <Route path='/twitter/token/:token' element={<AuthenticationFlow
                                                  provider={provider} 
                                                  account={account} 
                                                  connectWalletFunction={connectWallet}
                                                  credentialClaim={'creds'}
                                                  web2service={'Twitter'}
                                                  desiredChain={desiredChain} />} /> 
              <Route path='/GitHub/token/:token' element={<AuthenticationFlow
                                                  provider={provider} 
                                                  account={account} 
                                                  connectWalletFunction={connectWallet}
                                                  credentialClaim={'creds'}
                                                  web2service={'Github'}
                                                  desiredChain={desiredChain} />} /> 

              <Route path='/lookup/:web2service/:credentials' element={<Lookup provider={provider} desiredChain={desiredChain} />} />
              <Route path='/lookup' element={<Lookup provider={provider} />} />
              <Route path='/' element={<Registry provider={provider} address={account} desiredChain={desiredChain} />} />
              {/* <Route path='/private' element={<LitCeramic stringToEncrypt={JWTObject.header.raw + '.' + JWTObject.payload.raw}/>} /> */}
              <Route path='/myholo' element={<AuthenticationFlow 
                                          provider={provider}
                                          account={account} 
                                          connectWalletFunction={connectWallet}
                                          desiredChain={desiredChain} />} />
            </Routes>
          </Router>
          </div>

    // </Auth0Provider>
  );
}

export default App;
