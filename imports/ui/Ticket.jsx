import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class Ticket extends Component {

  render() {
  
    return (
      <li>
      <button>
            <a className="dapp-identicon dapp-small"></a>
            <h3>Description: {this.props.item.description}</h3>
            <span>Price: {this.props.item.TicketPrices.c[0]} ETH / {EthTools.formatBalance(this.props.item.TicketPrices.c[0], '0.0,[0]', 'eur')}€ </span>
            <span>Availability: {this.props.item.ticketsLeft.c[0]} Remaining</span>
       </button> 
      </li>

    );

  }

}
