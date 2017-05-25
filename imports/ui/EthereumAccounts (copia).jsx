
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



// Contract component - represents a single todo item
export default class EthereumAccounts extends Component{

    async callReg(){
        this.userRegistry = await selectContractInstance(userRegistry_artifacts,Session.get("reg_address"));
        const RightResp = await this.userRegistry.getRight.call(this.props.account.address);
        const Right = mapReponseToJSON(RightResp,"","");
        Session.set(this.props.account.address,Right);
  }



  render() {

      if(!Session.get("reg_address")){
            console.log(Session.get("reg_address"));
            this.callReg();
      }

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

    
  
