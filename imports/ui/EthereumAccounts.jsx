
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Import Components
import { Ethereum_Accounts } from '../api/ethereum_accounts.js';
import  userRegistry  from './userRegistry.jsx';



// Ethereum libraries and contracts

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'

// Contract component - represents a single todo item
export default class EthereumAccounts extends TrackerReact(Component) {


   constructor(){
    super();

    this.state = {
      subscription: {
        accounts: Meteor.subscribe('allAccounts')
      },
      rightVal: ""
    }
  }

  async componentWillMount() {
    this.userRegistry = await selectContractInstance(userRegistry_artifacts);

    const right = await this.getRight();
    this.setState( {rightVal: right} );
        console.log(this.state.rightVal);

}



  componentWillUnmount(){
    this.state.subscription.accounts.stop();

  } 

   accounts(){
    return Ethereum_Accounts.findOne({address: this.props.account.address});
  }

  async getRight(){
    let self = this;
    const RightResp = await this.userRegistry.getRight.call(self.props.account.address);
    const Right = mapReponseToJSON(RightResp,"","");
    return Right;
  }



  render() {

      var active;
      if(this.state.rightVal != null)
         active = this.state.rightVal ? "Activated" : "Inactive";
      return (

          <li>
          <button>
                <a className="dapp-identicon dapp-small"></a>
                <h3>{this.props.account.name}</h3>
                <span>{this.props.account.address}</span>
                <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                      /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
                </span> 
                Account Status: {active}
            </button>             
          </li>
          

        );
      
      }
    
  }

    
  
