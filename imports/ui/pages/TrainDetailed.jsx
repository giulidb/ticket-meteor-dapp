import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {transport} from '../../api/transport.js'

import {Meteor} from 'meteor/meteor';


// Ethereum libraries and contracts
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import transport_artifacts from '../../api/ethereum/truffle/build/contracts/Transport.json'

export default class TrainDetailed extends TrackerReact(Component){
  
  constructor(){
    super();

    this.state = {
            subscription: {
                contract: Meteor.subscribe('contractAddress')
            },
            account: Session.get('account'),
            gasPrice: 100000000000,
            gas: 2500000,
            Train: "",
            deposit: "",
    }
  }

  componentWillMount(){
            this.setState({Train: Session.get("train")});
            console.log(this.state.Train);

  }

  async loadContract(){
        this.Transport = await selectContractInstance(transport_artifacts,Session.get("contract_address"));
        const depositQuota = await this.Transport.depositQuota.call();
        this.setState({deposit: depositQuota});
  }

  async makeDeposit(addr) {
    this.Transport = await selectContractInstance(transport_artifacts,Session.get("contract_address"));
    const res = await  this.Transport.makeDeposit(JSON.stringify(this.state.Train),
                                            {from: this.state.account, gasPrice: this.state.gasPrice,
                                             gas: this.state.gas, value: this.state.deposit.valueOf()});
    console.log(res);
    Bert.alert('Congratulations! Your transaction has been successful!','success','fixed-top','fa-smile-o');

  } 

  componentWillUnmount(){
        this.state.subscription.contract.stop();

  }

  getContractAddr(){
    return transport.find({}).fetch();
  }


    render(){

        var addr = this.getContractAddr();
        if(addr.length > 0){  
              
               Session.set("contract_address",addr[0].address);
               this.loadContract();
       }
      
         if(!this.state.Train){
              return <div>No Pending orders</div>
            }
        
        var dP = new Date(Date.parse(this.state.Train.orarioPartenza));
        var dA = new Date(Date.parse(this.state.Train.orarioArrivo));
        var travelTime = new Date(Date.parse(this.state.Train.orarioArrivo) - Date.parse(this.state.Train.orarioPartenza));

     
      
              
        return(
             <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                
                  <h1>Order Summary</h1>

                  <div className="row clear">
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Departure: </label> <h3>{this.state.Train.origine}</h3>
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Destination: </label><h3> {this.state.Train.destinazione}</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Date: </label><h3>{("0" + (dP.getDay() + 1)).slice(-2)} / {("0" + (dP.getMonth() + 1)).slice(-2)} / {dP.getFullYear()} </h3>
                        </span>
                    </div>  
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Hour: </label><h3>{("0" + (dA.getHours() + 1)).slice(-2)} : {("0" + (dA.getMinutes() + 1)).slice(-2)}</h3>
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

            </div>
      <br/><br/><br/>
          <div className="row clear">
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Type: </label> <h3>{this.state.Train.categoriaDescrizione}</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Service Level: </label><h3>2° Class</h3>
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Ticket Type: </label><h3>Single Ticket</h3>
                        </span>
                    </div>  
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Total Price: </label><h3>5.50€ / 5.50 ETH</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Deposit: </label><h3> {EthTools.formatBalance(this.state.deposit.valueOf().valueOf(), '0.00', 'eur')}€ / {EthTools.formatBalance(this.state.deposit.valueOf(), '0.000', 'ether')} ETH</h3>
                        </span>
                    </div>     

              </div>
                <br/><br/><br/>
                <hr/>
              
              <div className="row clear">
                    <div className="col col-6 tablet-col-11 mobile-col-1-2">
                        <input type="submit" value= "Deposit for blockchain" onClick = {this.makeDeposit.bind(this)} />
                            <br/>                       
                        <input type="submit" value= "Buy" disabled = {true} />
                            <br/>
                        <input type="submit" value= "Refund" disabled = {true} />
                   </div> 
                        
                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                        <h3>Ticket status</h3>
                    </div> 
               </div>

                
               </ReactCSSTransitionGroup>
                
        )
    }

}