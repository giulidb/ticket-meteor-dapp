
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Ethereum_Accounts } from '../api/ethereum_accounts.js';

// Contract component - represents a single todo item
export default class EthereumAccounts extends TrackerReact(Component) {


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
    return Ethereum_Accounts.findOne({address: this.props.account.address});
  }

  render() {

    var active;
    if(!this.state.subscription.accounts.ready)
        <div>Loading...</div>

    else{   
      {
         var acc =this.accounts();
         if(acc != null){
            active = (acc.active)?"Active":"Inactive";
            console.log(active);
        }
      

      return (

          <li>
          <button>
                <a className="dapp-identicon dapp-small"></a>
                <h3>{this.props.account.name}</h3>
                <span>{this.props.account.address}</span>
                <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                      /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
                </span>
                <span>{active}</span>
                
            </button>               
          </li>

        );
      }
    }
  }
}