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
        
            Meteor.call("getFacebookId", (error, response)=>{
                    Session.set("FacebookId",response);
            });

            this.setState({expiration: ("0" + (exp.getDate())).slice(-2) + "/" + ("0" + (exp.getMonth() + 1)).slice(-2) + "/" + exp.getFullYear()});   
            this.loadContract();
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
            if(new Date(this.state.Train.expirationDate*1000) < new Date()){
                    tempStatus.value = "expired";
                    tempStatus.label = "Ticket expired! You can't use it anymore.";
                    this.setState({status: tempStatus});
                    return
                }

            var status = web3.toUtf8(TicketItemResp[3]).trim();
                            switch(status){
                                    case "requested":
                                            var requestTime = new Date(TicketItemResp[1].valueOf() * 1000);
                                            var deadline = new Date(requestTime.getTime() + 30*60000);  
                                            tempStatus.value = "requested";
                                            tempStatus.label = "Waiting for emission in blockchain, if the the ticket will be not emitted within the  "+
                                                                ("0" + (deadline.getDate())).slice(-2) + "/" + ("0" + (deadline.getMonth() + 1)).slice(-2) + "/" + deadline.getFullYear()+" at " +
                                                                ("0" + (deadline.getHours() + 1)).slice(-2) + ":" + ("0" + (deadline.getMinutes() + 1)).slice(-2) +
                                                                "  you can withdraw your deposit back.";
                                            break;

                                    case "emitted":   
                                            var emitTime = new Date(TicketItemResp[2].valueOf() * 1000);                                      
                                            var deadline = new Date(emitTime.getTime() + 30*60000);    
                                            tempStatus.value = "emitted";
                                            tempStatus.label = "Ticket emitted, you can buy it whithin the " + ("0" + (deadline.getDate())).slice(-2) + "/" + 
                                                                ("0" + (deadline.getMonth() + 1)).slice(-2) + "/" + deadline.getFullYear()+" at " +
                                                                ("0" + (deadline.getHours() + 1)).slice(-2) + ":" + ("0" + (deadline.getMinutes() + 1)).slice(-2) + ".";
                                            break;
                                    case "valid":
                                            tempStatus.value = "valid";
                                            tempStatus.label = "Ticket valid, you can use it. \n\r Num Used: " +
                                            TicketItemResp[4].valueOf();
                                }

                            this.setState({status: tempStatus});
  }  

  async loadContract(){
                var addr = this.getContractAddr();
                this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
                const depositQuota = await this.Transport.depositQuota.call();
                this.setState({deposit: depositQuota});
                var tempStatus = { value: "", label: ""};
                if(Session.get("ReqPage") == "Blockchain"){
                        if(new Date(this.state.Train.expirationDate*1000) < new Date()){
                                tempStatus.value = "expired";
                                tempStatus.label = "Ticket expired! You can't use it anymore.";
                                this.setState({status: tempStatus});
                        return
                        }
                        const TicketItemResp = await this.Transport.getTicket.call(this.state.account,Session.get("Index"));
                        var status = web3.toUtf8(TicketItemResp[3]).trim();
                        switch(status){
                            case "requested":
                                            var requestTime = new Date(TicketItemResp[1].valueOf() * 1000);
                                            var deadline = new Date(requestTime.getTime() + 30*60000);  
                                            tempStatus.value = "requested";
                                            tempStatus.label = "Waiting for emission in blockchain, if the the ticket will be not emitted within the  "+
                                                                ("0" + (deadline.getDate())).slice(-2) + "/" + ("0" + (deadline.getMonth() + 1)).slice(-2) + "/" + deadline.getFullYear()+" at " +
                                                                ("0" + (deadline.getHours() + 1)).slice(-2) + ":" + ("0" + (deadline.getMinutes() + 1)).slice(-2) +
                                                                "  you can withdraw your deposit back.";
                                            break;

                                    case "emitted":
                                            var emitTime = new Date(TicketItemResp[2].valueOf() * 1000);                                      
                                            var deadline = new Date(emitTime.getTime() + 30*60000);  
                                            tempStatus.value = "emitted";
                                            tempStatus.label = "Ticket emitted, you can buy it whithin the " + ("0" + (deadline.getDate())).slice(-2) + "/" + 
                                                                ("0" + (deadline.getMonth() + 1)).slice(-2) + "/" + deadline.getFullYear()+" at " +
                                                                ("0" + (deadline.getHours() + 1)).slice(-2) + ":" + ("0" + (deadline.getMinutes() + 1)).slice(-2) + ".";
                                            break;
                                    case "valid":
                                            tempStatus.value = "valid";
                                            tempStatus.label = "Ticket valid, you can use it. \n\r Num Used: " +
                                            TicketItemResp[4].valueOf();
                        }

                }
                else{
                    tempStatus.value = "notrequested";
                    tempStatus.label ="Not requested yet, make deposit for asking emission";
                }

                    this.setState({status: tempStatus});

  }


  async makeDeposit() {
            var addr = this.getContractAddr();
            this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
            var max_uses = (this.state.Train.ticketType == "10 Tickets Carnet") ? 10 : ((this.state.Train.ticketType == "Simple Ticket") ? 1 :"");
            const res = await  this.Transport.makeDeposit(JSON.stringify(this.state.Train), 
                                                        web3.sha3(Session.get("FacebookId")),
                                                        this.state.Train.price,this.state.Train.expirationDate,max_uses,
                                                    {from: this.state.account, gasPrice: this.state.gasPrice,
                                                    gas: this.state.gas, value: this.state.deposit.valueOf()});
            console.log(res);
            Bert.alert('Congratulations! Your transaction has been successful!','success','growl-top-right','fa-smile-o');
            var numTicket = await this.Transport.numTickets.call(this.state.account);
            Session.set("Index",numTicket.valueOf()-1);
            this.refreshStatus();
            var self = this;
            Meteor.call("configureTicket",this.state.Train, this.state.account,(error, response)=>{
                        console.log(error);
                        console.log("Configure Ticket Done");
                        self.startEventListerner();

                });

    } 

    async buy() {
        
            var addr = this.getContractAddr();
            this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
                    const res = await  this.Transport.buyTicket(Session.get("Index"),
                                                    {from: this.state.account, gasPrice: this.state.gasPrice,
                                                    gas: this.state.gas, value: (this.state.Train.price)});
            console.log(res);
            this.startEventListerner();
            Bert.alert('Congratulations! Your transaction has been successful!','success','growl-top-right','fa-smile-o');

        } 


  componentWillUnmount(){
            this.state.subscription.contract.stop();

  }


  getContractAddr(){
            return transport.find({}).fetch();
  }


async use(){
            var contract_addr = this.getContractAddr();
            this.Transport = await selectContractInstance(transport_artifacts,contract_addr[0].address);
            const res = await  this.Transport.useTicket(Session.get("Index"),
                                                    {from: this.state.account, gasPrice: this.state.gasPrice,
                                                    gas: this.state.gas});
            console.log(res);
            this.startEventListerner();
            Bert.alert('Congratulations! Your convalidation has been successful!','success','growl-top-right','fa-smile-o');
}

async refund() {
            console.log("refund");
            console.log(Session.get("Index"));
            var addr = this.getContractAddr();
            this.Transport = await selectContractInstance(transport_artifacts,addr[0].address);
            const res = await  this.Transport.withdrawDeposit(Session.get("Index"),
                                                    {from: this.state.account, gasPrice: this.state.gasPrice,
                                                    gas: this.state.gas});
            console.log(res);
            var tempStatus = { value: "Refund", label: "Deposit refund. Ticket has been deleted!"};
            this.setState({status: tempStatus});
            Bert.alert('Congratulations! Your deposit has been credited on your account!','success','growl-top-right','fa-smile-o');

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
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Ticket Type: </label><h3>{this.state.Train.ticketType}</h3>
                        </span>
                    </div>  
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Ticket Price: </label><h3>{EthTools.formatBalance(this.state.Train.price ,'0.00','eur')} € / {EthTools.formatBalance(this.state.Train.price ,'0.00','ether')} ETH</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Deposit Fee: </label><h3> {EthTools.formatBalance(this.state.deposit.valueOf(), '0.00', 'eur')}€ / {EthTools.formatBalance(this.state.deposit.valueOf(), '0.000', 'ether')} ETH</h3>
                        </span>
                    </div>     

              </div>
      </div> );
    
    

  }


    render(){
      
         if(!this.state.Train){
              return <div>No Pending orders</div>
            }
      
              
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
                                             disabled = { (this.state.status.value != "notrequested") ? true : false }/>
                            <br/>                       
                        <input type="submit" value= "Buy"  onClick = {this.buy.bind(this)}
                                             disabled = {(this.state.status.value != "emitted") ? true : false} />
                            <br/>

                        <input type="submit" value= "Deposit Refund" onClick = {this.refund.bind(this)}
                                             disabled = {(this.state.status.value != "requested") ? true : false} />
                             <br/>
                        <input type="submit" value= "Use" onClick = {this.use.bind(this)}
                                             disabled = {(this.state.status.value != "valid") ? true : false} />
                   </div> 
                        
                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                        <h3>Ticket status</h3>
                        <div className = {!this.state.status.label ? "loader" : ""}>{this.state.status.label}</div>
                    </div> 
               </div>

               <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/>
            </ReactCSSTransitionGroup>
                
        )
    }

}