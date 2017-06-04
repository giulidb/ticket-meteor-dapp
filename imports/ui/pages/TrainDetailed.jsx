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
            expiration: "",
            status: {
                value: "",
                label: ""
            }
    }
  }

   getContractAddr(){
        return transport.find({}).fetch();
  }

  componentWillMount(){
            this.setState({Train: Session.get("trainTicket")});     
}


componentDidMount(){
    this.setState({adults: "Adults: " + this.state.Train.adults});
            if(this.state.Train.children >0 )
                this.setState({adults: "Children: " + this.state.Train.children});
    var dP = new Date(Date.parse(this.state.Train.orarioPartenza));
    var dA = new Date(Date.parse(this.state.Train.orarioArrivo));  
    if(this.state.Train.ticketType == "Simple Ticket"){            
            this.setState({dP: ("0" + (dP.getHours() + 1)).slice(-2) + ":" + ("0" + (dP.getMinutes() + 1)).slice(-2)});
            this.setState({dA: ("0" + (dP.getHours() + 1)).slice(-2) + ":" + ("0" + (dA.getMinutes() + 1)).slice(-2)});    
    }
     var exp = new Date(this.state.Train.expirationDate*1000);
 
     this.setState({expiration: ("0" + (exp.getDate())).slice(-2) + "/" + ("0" + (exp.getMonth() + 1)).slice(-2) + "/" + exp.getFullYear()});   
     this.loadContract();
     this.startEventListerner();
    

}

   async startEventListerner(){
        var addr = this.getContractAddr();
        var self = this;
        this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
        this.Transport.allEvents(function(error,log){
                if(!error){
                    self.refreshStatus();
                }
            });

    }  

  async refreshStatus(){
       var addr = this.getContractAddr();
       this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
       var tempStatus = { value: "", label: ""};
       const TicketItemResp = await this.Transport.getTicket.call(this.state.account,Session.get("Index"));
                    console.log(TicketItemResp);
                    console.log( web3.toUtf8(TicketItemResp[3]).trim())
                    var status = web3.toUtf8(TicketItemResp[3]).trim();
                    switch(status){
                            case "requested":
                                    tempStatus.value = "requested";
                                    tempStatus.label = "Waiting for emission in blockchain";
                                    break;
                            case "emitted":        
                                    tempStatus.value = "emitted";
                                    tempStatus.label = "Ticket emitted, you can buy it";
                                    break;
                            case "valid":
                                    tempStatus.value = "valid";
                                    tempStatus.label = "Ticket valid, you can use it";
                        }

                    this.setState({status: tempStatus});
                    console.log(this.state.status);
  }  

  async loadContract(){
        var addr = this.getContractAddr();
        this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
        const depositQuota = await this.Transport.depositQuota.call();
        this.setState({deposit: depositQuota});
        var tempStatus = { value: "", label: ""};
        if(Session.get("ReqPage") == "Blockchain"){
                const TicketItemResp = await this.Transport.getTicket.call(this.state.account,Session.get("Index"));
                console.log(TicketItemResp);
                console.log( web3.toUtf8(TicketItemResp[3]).trim())
                var status = web3.toUtf8(TicketItemResp[3]).trim();
                switch(status){
                    case "requested":
                            tempStatus.value = "requested";
                            tempStatus.label = "Waiting for emission in blockchain";
                            break;
                    case "emitted":        
                            tempStatus.value = "emitted";
                            tempStatus.label = "Ticket emitted, you can buy it";
                            break;
                    case "valid":
                            tempStatus.value = "valid";
                            tempStatus.label = "Ticket valid, you can use it";
                  }

        }
        else{
            tempStatus.value = "notrequested";
            tempStatus.label ="Not requested yet, make deposit for asking emission";
        }

            this.setState({status: tempStatus});
            console.log(this.state.status);

  }

  async makeDeposit() {
    var addr = this.getContractAddr();
    this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
    console.log(addr[0].address);
    console.log(this.state.deposit.valueOf());
    console.log(this.state.Train);
    const res = await  this.Transport.makeDeposit(JSON.stringify(this.state.Train),
                                            {from: this.state.account, gasPrice: this.state.gasPrice,
                                             gas: this.state.gas, value: this.state.deposit.valueOf()});
    console.log(res);
    Bert.alert('Congratulations! Your transaction has been successful!','success','fixed-top','fa-smile-o');
    var numTicket = await this.Transport.numTickets.call(this.state.account);
    Session.set("Index",numTicket.valueOf()-1);
    Meteor.call("configureTicket",this.state.Train, this.state.account,(error, response)=>{
                console.log(error);
                console.log("return method");
        });

    } 

    async buy() {
    var addr = this.getContractAddr();
    this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
    console.log(this.state.Train.price - this.state.deposit.valueOf());
    console.log(Session.get("Index"));
    const res = await  this.Transport.buyTicket(Session.get("Index"),
                                            {from: this.state.account, gasPrice: this.state.gasPrice,
                                             gas: this.state.gas, value: (this.state.Train.price - this.state.deposit.valueOf())});
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
                          <label>Expiration: </label><h3>{this.state.expiration}</h3>
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
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Type: </label> <h3>{this.state.Train.trainType}</h3>
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
                           <label>Total Price: </label><h3>{EthTools.formatBalance(this.state.Train.price ,'0.00','eur')} € / {EthTools.formatBalance(this.state.Train.price ,'0.00','ether')} ETH</h3>
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
                        <input type="submit" value= "Deposit for blockchain" onClick = {this.makeDeposit.bind(this)}
                                             disabled = { (this.state.status.value == "notrequested") ? false : true}/>
                            <br/>                       
                        <input type="submit" value= "Buy"  onClick = {this.buy.bind(this)}
                                             disabled = {(this.state.status.value == "emitted") ? false : true} />
                            <br/>
                        <input type="submit" value= "Deposit Refund" disabled = {true}
                                             disabled = {(this.state.status.value == "requested") ? false : true} />
                             <br/>
                        <input type="submit" value= "Use" disabled = {true}
                                             disabled = {(this.state.status.value == "valid") ? false : true} />
                       <br/><br/>
                       <hr/>  
                   </div> 
                        
                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                        <h3>Ticket status</h3>
                        <div className = {!this.state.status.label ? "loader" : ""}>{this.state.status.label}</div>
                    </div> 
               </div>
                               
               </ReactCSSTransitionGroup>
                
        )
    }

}