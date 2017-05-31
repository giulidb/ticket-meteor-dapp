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

   seeTicket(){
       
        Session.set("trainTicket", JSON.parse(this.props.item.description));
        FlowRouter.go('/trains/'+ this.props.index);
    }

    render() {

        //console.log(this.props.item.description);
        var item = JSON.parse(this.props.item.description);
        var status;
        switch(this.props.item.status){
            case "requested":
                    status = "Waiting for emission in blockchain"
                    break;
            case "emitted":        
                    status = "Ticket emitted, you can buy it"
                    break;
            case "valid":
                    status = "Ticket valid, you can use it"        
        }

        return (
                
        <li>
            <div className="row clear">
                <button  onClick={this.seeTicket.bind(this)}> 
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <span>{item.origine}</span>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <span> {item.destinazione}</span>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <span> {item.categoriaDescrizione}</span>
                        </span>
                    </div>  
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <span>Single Ticket</span>
                        </span>
                    </div>     
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <span>{status}</span>
                        </span>
                    </div>   
                </button>     
            </div>
            <hr/>
        </li>
    );

  }

}
