import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// Import libraries
import Web3 from '../../api/ethereum/web3.js';

import EthereumAccounts from '../EthereumAccounts.jsx';


export default class AccountsSettings extends Component {


  accounts(){
    EthAccounts.init();
    return EthAccounts.find().fetch();      
  }

  render() {

    return (
          <ReactCSSTransitionGroup
             component="div"
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <h3>My Accounts List</h3>
             <ul className="dapp-account-list">
                 {this.accounts().map((account)=>{
                  return <EthereumAccounts key={account._id} account = {account}/>
                  }
                 )}
             </ul> 
         </ReactCSSTransitionGroup>

    );
  }
}
