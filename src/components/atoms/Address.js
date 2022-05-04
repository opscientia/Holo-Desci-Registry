import { truncateAddress } from "../../utils/ui-helpers";
import userIcon from "../../img/User.svg";
import { useAccount } from "wagmi";

// profile pic and truncated address
const InnerContent = (props) => {
  return (
    <>
      <img src={userIcon} loading="lazy" alt="" class="wallet-icon" />
      <div class="wallet-text">{truncateAddress(props.address)}</div>
    </>
  );
};

const Address = (props) => {
  const { data: account, refetch } = useAccount();
  const onMyHolo = window.location.href.endsWith("myholo");
  console.log("onMyHolo", onMyHolo);

  return (
    <div class="nav-btn" style={{ maxHeight: "64px" }}>
      {onMyHolo ? (
        <div onClick={refetch} className="wallet-connected">
          <InnerContent address={account.address} />
        </div>
      ) : (
        <a href="/myholo" className="wallet-connected">
          <InnerContent address={account.address} />
        </a>
      )}
    </div>
  );
};

export default Address;
