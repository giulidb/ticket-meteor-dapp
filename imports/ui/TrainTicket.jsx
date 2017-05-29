import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';

// Ethereum libraries and contracts
import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import event_artifacts from '../api/ethereum/truffle/build/contracts/Event.json'

// Contract component - represents a single todo item
export default class TrainTicket extends Component {

    constructor(){
        super();

        this.state = {

            account: Session.get('account'),
            gasPrice: 100000000000,
            gas: 2500000,
      
        }
        
  }

    render() {


        return (
                
        <li>
        </li>
    );

  }

}
