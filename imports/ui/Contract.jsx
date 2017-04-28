
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class Contract extends Component {

  render() {
    

    return (
      <li>
      <button>
            <a className="dapp-identicon dapp-small"></a>
            <h3>Event Name</h3>
           
            
        </button>  
              <a href={'/events/'+ this.props.contract._id }>
              Contract address: {this.props.contract.address}</a>
      </li>

    );

  }

}