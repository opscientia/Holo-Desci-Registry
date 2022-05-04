import { truncateAddress } from '../ui-helpers';
import userIcon from "../img/User.svg";

// profile pic and truncated address
const InnerContent = (props) =>
<>
    <img src={userIcon} loading="lazy" alt="" class="wallet-icon" />
    <div class="wallet-text">{truncateAddress(props.address)}</div>
</>

const Address = (props)=>{
    const switchAccounts = () =>{
        if(props.provider && props.provider.provider.request){
            props.provider.provider.request({
                method: 'wallet_requestPermissions',
                params: [{
                eth_accounts: {},
                }]
            });
        }
    }

    const onMyHolo = window.location.href.endsWith('myholo') 
    console.log('onMyHolo', onMyHolo)
    return <div class="nav-btn" style={{maxHeight:'64px'}}>
                {/* <a href="#" class="x-button secondary outline-menu w-button">connect wallet</a> */}
                {/* <div onClick={switchAccounts} className="wallet-connected"> */}
                {onMyHolo ? 
                    <div onClick={switchAccounts} className="wallet-connected">
                        <InnerContent {...props} />
                    </div>
                    : 
                    <a href='/myholo' className='wallet-connected'>
                        <InnerContent {...props} />
                    </a> 
                }
                
                {/* <a href='/myholo' class='nav-link w-nav-link'>My Holo</a> */}

            </div>
}

export default Address;