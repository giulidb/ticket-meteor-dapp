
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class EthereumAccounts extends Component {


  render() {
    
    return (
  
      <li>
      <button>
            <a className="dapp-identicon dapp-small"></a>
            <h3>{this.props.account.name}</h3>
             <span>{this.props.account.address}</span>
             <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                   /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
             </span>
            
        </button>               
      </li>

    );

  }

}