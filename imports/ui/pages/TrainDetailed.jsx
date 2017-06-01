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
            adults:"",
            children:"",
            dP: "",
            dA:"",
            date: "",
            expiration:""
    }
  }

   getContractAddr(){
        return transport.find({}).fetch();
  }

  componentWillMount(){
            this.setState({Train: Session.get("trainTicket")});
            this.setState({expiration: new Date(Date.parse(this.state.Train.expirationDate))});
            console.log("Component will Mount");
            console.log(this.state.Train.expirationDate);
            console.log(this.state.expiration);


            
}

componentDidMount(){
    this.setState({adults: "Adults: " + this.state.Train.adults});
            if(this.state.Train.children >0 )
                this.setState({adults: "Children: " + this.state.Train.children});
    console.log(this.state.Train.ticketType);  
    var dP = new Date(Date.parse(this.state.Train.orarioPartenza));
    var dA = new Date(Date.parse(this.state.Train.orarioArrivo));  
    if(this.state.Train.ticketType == "Simple Ticket"){            
            this.setState({dP: ("0" + (dP.getHours() + 1)).slice(-2) + ":" + ("0" + (dP.getMinutes() + 1)).slice(-2)});
            this.setState({dA: ("0" + (dP.getHours() + 1)).slice(-2) + ":" + ("0" + (dA.getMinutes() + 1)).slice(-2)});    
    }
    this.loadContract();
    
}

  async loadContract(){
        var addr = this.getContractAddr();
        console.log(addr);
        this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
        const depositQuota = await this.Transport.depositQuota.call();
        this.setState({deposit: depositQuota});
  }

  async makeDeposit(addr) {
    var addr = this.getContractAddr();
    console.log(addr);
    this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
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

  renderTicket(){

  
        return( 

            <div> 
                <h1>Ticket Summary</h1>

                  <div className="row clear">
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Departure: </label> <h3>{this.state.Train.origine}</h3>
                          <p>{this.state.dP}</p>
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Destination: </label><h3> {this.state.Train.destinazione}</h3>
                          <p>{this.state.dA}</p>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Expiration: </label><h3>{("0" + (this.state.expiration.getDate())).slice(-2) + "/" + ("0" + (this.state.expiration.getMonth() + 1)).slice(-2) + "/" + this.state.expiration.getFullYear()} </h3>
                        </span>
                    </div> 
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Passengers: </label>
                                 <h3>{this.state.adults}</h3>
                                 <p>{this.state.children}</p>
                        </span>
                    </div>  
                </div>
          
                <br/><br/><br/><br/>
          
                <div className="row clear">
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Type: </label> <h3>{this.state.Train.categoriaDescrizione}</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Service Level: </label><h3>{this.state.Train.class}</h3>
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Ticket Type: </label><h3>{this.state.Train.ticketType}</h3>
                        </span>
                    </div>  
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Total Price: </label><h3>{this.state.Train.price} € / {EthTools.formatBalance(EthTools.toWei(this.state.Train.price,'eur'),'0.00','ether')} ETH</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Deposit: </label><h3> {EthTools.formatBalance(this.state.deposit.valueOf(), '0.00', 'eur')}€ / {EthTools.formatBalance(this.state.deposit.valueOf(), '0.000', 'ether')} ETH</h3>
                        </span>
                    </div>     

              </div>
      </div> );
    
    

  }


    render(){
      
         if(!this.state.Train){
              return <div>No Pending orders</div>
            }
        console.log("Train Detailed");
        console.log(this.state.Train);   
      
              
        return(
             <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                
                 {this.renderTicket()}
               
            <br/><br/><br/>
            <hr/>
              
              <div className="row clear">
                    <div className="col col-6 tablet-col-11 mobile-col-1-2">
                        <input type="submit" value= "Deposit for blockchain" onClick = {this.makeDeposit.bind(this)} />
                            <br/>                       
                        <input type="submit" value= "Buy" disabled = {true} />
                            <br/>
                        <input type="submit" value= "Refund" disabled = {true} />
                             <br/>
                        <input type="submit" value= "Use" disabled = {true} />
                   </div> 
                        
                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                        <h3>Ticket status</h3>
                    </div> 
               </div>

                
               </ReactCSSTransitionGroup>
                
        )
    }

}