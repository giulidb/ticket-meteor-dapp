
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



// Contract component - represents a single todo item
export default class EthereumAccounts extends Component{




  render() {

      return (

      
                  <div>
                          <h3>{this.props.account.name}</h3>
                          <span>{this.props.account.address}</span><br/>
                          <span>{EthTools.formatBalance(this.props.account.balance, '0.00 unit', 'ether')}
                                /{EthTools.formatBalance(this.props.account.balance, '0.00', 'eur')}€
                          </span> 
                   </div>                    
      
          

        );
      
      }
    
  }

    
  
