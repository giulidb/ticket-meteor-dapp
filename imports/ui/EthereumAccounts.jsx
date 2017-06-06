
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



// Contract component - represents a single todo item
export default class EthereumAccounts extends Component{

  constructor(){
    super();
    this.state = {
      account: EthAccounts.findOne({address: Session.get('account')})
    }
  }


  render() {

      console.log(EthAccounts.findOne({address: Session.get('account')}));

      console.log(EthAccounts.find({}));
      return (
        <div>
            <h3>{Session.get("account")//this.state.account.name
              }</h3>
                   {/*       <span>{//this.state.account.address
                            }</span><br/>
                          <span>{//EthTools.formatBalance(this.state.account.balance, '0.00 unit', 'ether')}
                               // /{EthTools.formatBalance(this.state.account.balance, '0.00', 'eur')
                               }
                          </span>        */}
       </div>
        );
      
      }
    
  }

    
  
