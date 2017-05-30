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
            <div className="row clear">
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Departure: </label> <h3>{this.state.props.origine}</h3>
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Destination: </label><h3> {this.state.props.destinazione}</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Type: </label><h3> Regionale</h3><br/>Single Ticket
                        </span>
                    </div>  
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Adults: </label><h3>1</h3>
                        </span>
                    </div>    
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Children: </label><h3>0</h3>
                        </span>
                    </div>     
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Status: </label><h3>Waiting for emission in blockchain</h3>
                        </span>
                    </div>   
                     
            </div>
        </li>
    );

  }

}
