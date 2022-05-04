import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";

// import Refresh from '../img/refresh.svg';

/** ORCID **/
export const ORCIDLoginButton = (props) => {
  return (
    <a
      className="card-link"
      href="https://orcid.org/signin?response_type=token&redirect_uri=https:%2F%2Fwhoisthis.wtf/orcid/token/&client_id=APP-MPLI0FQRUVFEKMYX&scope=openid&nonce=whatever"
    >
      {props.creds ? "Update ORCID" : "Link ORCID"}
    </a>
  );
};

/** Twitter **/
export const TwitterLoginButton = (props) => {
  return (
    <a className="card-link" href="http://143.198.251.86:8081/twitter/gnosis/verify">
      {props.creds ? "Update Twitter" : "Link Twitter"}
    </a>
  );
};

export const GitHubLoginButton = (props) => {
  return (
    <a className="card-link" href="http://143.198.251.86:8081/auth/github">
      {props.creds ? "Update GitHub" : "Link GitHub"}
    </a>
  );
};

/** Google **/
const InnerGoogleLoginButton = (props) => {
  console.log("propss", props);
  return (
    <a className="card-link" onClick={props.onClick} disabled={props.disabled}>
      {props.creds ? "Update Google" : "Link Google"}
    </a>
  );
};

// Provides a simple component, GoogleLoginButton, which wraps two more components: the GoogleLogin component from npm package, which renders a custom InnerGoogleLoginButton
export const GoogleLoginButton = (props) => {
  const navigate = useNavigate();
  return (
    <GoogleLogin
      clientId="254984500566-3qis54mofeg5edogaujrp8rb7pbp9qtn.apps.googleusercontent.com"
      render={(renderProps) => <InnerGoogleLoginButton {...renderProps} {...props} />}
      onSuccess={(r) => navigate(`/google/token/id_token=${r.tokenId}`)}
    />
  );
};
