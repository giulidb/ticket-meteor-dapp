import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Import libraries
import Web3 from '../../api/ethereum/web3.js';

import { Ethereum_Accounts } from '../../api/ethereum_accounts.js';
import EthereumAccounts from '../EthereumAccounts.jsx';


export default class AccountsSettings extends TrackerReact(Component) {

   constructor(){
    super();

    this.state = {
      subscription: {
        accounts: Meteor.subscribe('allAccounts')
      }
    }

    

  }

  componentWillUnmount(){
    this.state.subscription.accounts.stop();

  } 

  accounts(){
    EthAccounts.init();
    return EthAccounts.find().fetch();      
  }

  render() {

     console.log(Ethereum_Accounts.find({}).fetch()); 

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
