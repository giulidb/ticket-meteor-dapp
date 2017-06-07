
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



// Contract component - represents a single todo item
export default class EthereumAccounts extends Component{

  account(){
       EthAccounts.init(); 
       return EthAccounts.findOne({address: Session.get('account')});
  }


  render() {

      var account = this.account();
      console.log(account);
      return (
          <li>
                  <a className="dapp-identicon dapp-small" href=""></a>
                  <h3>Ethereum Account</h3>
                  <span>{account.address}</span><br/>
                  <span>{EthTools.formatBalance(account.balance, '0.00 unit', 'ether')}
                   / {EthTools.formatBalance(account.balance, '0.00', 'eur')} €</span>       
        </li>
        );
      }
    
  }

    
  
