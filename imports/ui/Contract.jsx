
import React, {Component} from 'react';
import PropTypes from 'prop-types';
 

// Contract component - represents a single todo item
export default class Contract extends Component {

  
  toggleChecked(){
    

  }

  render() {
    

    return (
      <li>
      <button onClick={this.toggleChecked.bind(this)}>
            <a className="dapp-identicon dapp-small"></a>
            <h3>Event Name</h3>
            {this.props.contract.address}
        </button>  

      </li>

    );

  }

}

 
/*
Contract.propTypes = {

  // This component gets the contract to display through a React prop.

  // We can use propTypes to indicate it is required

  contract: PropTypes.object.isRequired,

};*/