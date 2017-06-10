
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



// Contract component - represents a single todo item
export default class EthereumAccounts extends Component{   

async getBalance(){
    
    if(Session.get('account')){
        var balance = await web3.eth.getBalance(Session.get('account')).valueOf();
        Session.set('accountBalance',balance);}
    }


  render() {

    this.getBalance();
    var balance = !(Session.get('accountBalance')) ? 0 : Session.get('accountBalance');
 
      return (
          <li>
                  <a className="dapp-identicon dapp-small" href=""></a>
                  <h3>Ethereum Account</h3>
                  <span>{Session.get('account')}</span><br/>
                  <span>{EthTools.formatBalance(balance, '0.00 unit', 'ether')}
                   / {EthTools.formatBalance(balance, '0.00', 'eur')} €</span>       
        </li>
        );
      }
    
  }

    
  
