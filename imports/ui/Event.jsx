
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class Event extends Component {

  render() {
  
    return (
      <li>
      <button>
            <a className="dapp-identicon dapp-small" href={'/events/'+ this.props.event._id}></a>
            <h3>{this.props.event.name}</h3>
             <span>{this.props.event.description}</span>
                <span>{this.props.event.location} - {this.props.event.date}</span>
       </button> 
      </li>

    );

  }

}