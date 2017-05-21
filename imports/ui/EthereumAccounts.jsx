
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Import Components
import { Ethereum_Accounts } from '../api/ethereum_accounts.js';



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

    
  
