import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import transport_artifacts from '../api/ethereum/truffle/build/contracts/Transport.json'
import event_artifacts from '../api/ethereum/truffle/build/contracts/Event.json'
import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';

export default class Contract extends TrackerReact(Component) {

 constructor(){
    super();

    this.state = {
        userAddress: 'User Address: ',
        userId: 'User Id: ',
        ticketId: 'Ticket Id:',
        account: "",
        gasPrice: 100000000000,
        gas: 2500000,
        statusIdentity: "",
        statusTicket: ""
    }
 }

componentWillMount(){
 this.setState({account: web3.eth.coinbase});
}

async verifyIdentity(){
    var verified
    if(this.props.type == "Event"){
        this.Event = await selectContractInstance(event_artifacts,this.props.contract.address);
        verified = await this.Event.verifyIdentity.call(this.state.userAddress,web3.sha3(this.state.userId));
 }else{
        this.Transport = await selectContractInstance(transport_artifacts,this.props.contract.address);
        verified = await this.Transport.verifyIdentity.call(this.state.userAddress,web3.sha3(this.state.userId));
   }

   if(verified)
        this.setState({statusIdentity: "Identity verified"});
   else
       this.setState({statusIdentity: "Identity not verified"});


}

async withdraw(){
    if(this.props.type == "Event"){
        this.Event = await selectContractInstance(event_artifacts,this.props.contract.address);
        this.Event.withdraw({from: this.state.account, gasPrice: this.state.gasPrice,
                                             gas: this.state.gas});
    }else{
        this.Transport = await selectContractInstance(transport_artifacts,this.props.contract.address);
        this.Transport.withdraw({from: this.state.account, gasPrice: this.state.gasPrice,
                                             gas: this.state.gas});
    }
}

async getTicket(){
    var Ticket = [];
    var statusTemp;
    if(this.props.type == "Event"){
        this.Event = await selectContractInstance(event_artifacts,this.props.contract.address);
        Ticket = await this.Event.getTicket.call(this.state.userAddress,this.state.ticketId);
        console.log(Ticket);
        statusTemp = "Num Ticket Owned: " + Ticket[0].valueOf();
        if(Ticket[0].valueOf() > 0){
            var used = (Ticket[1]) ? " - Used" : " - Not Used";
        statusTemp += used;    
        }
            

     }else{
        this.Transport = await selectContractInstance(transport_artifacts,this.props.contract.address);
        Ticket = await this.Transport.getTicket.call(this.state.userAddress,this.state.ticketId);
        console.log(Ticket);
        statusTemp = "Ticket status: " + web3.toUtf8(Ticket[3]).trim();
   }

    this.setState({statusTicket: statusTemp});

    

}

userAddressChange(e){
         this.setState({userAddress: e.target.value});
}

userIdChange(e){
         this.setState({userId: e.target.value});
}

ticketIdChange(e){
        this.setState({ticketId: e.target.value});

}



   render() {

    var wei = web3.eth.getBalance(this.props.contract.address).valueOf();
        return (
                
            <li><hr/><div className="row clear">
                <div className="col col-4 tablet-col-11 mobile-col-1-2">
                    <span className="no-tablet no-mobile">
                                    <h3>Contract Name: {this.props.contract.name}</h3>
                                    <span>Contract Address: <br/>{this.props.contract.address} </span><br/><br/><br/>
                                     <button onClick={this.withdraw.bind(this)}>
                                        <h3>Withdraw Revenue</h3>
                                        <span>Contract Balance: {web3.fromWei(wei,'ether')} ETH 
                                            / {EthTools.formatBalance(wei, '0.00', 'eur')}€ </span>
                                    </button>
                    </span>
                </div>
                <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                          <input type="text" name="from" value={this.state.userAddress} onChange={this.userAddressChange.bind(this)} /> 
                        <br/>
                          <input type="text" name="from" value={this.state.ticketId} onChange={this.ticketIdChange.bind(this)} /> 
                        <br/><br/>
                            <button onClick={this.getTicket.bind(this)}>
                                <h3>Verify Ticket</h3>
                            </button>
                            {this.state.statusTicket}
                    </span>
                </div>
                <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                          <input type="text" name="from" value={this.state.userAddress} onChange={this.userAddressChange.bind(this)} /> 
                        <br/>
                          <input type="text" name="from" value={this.state.userId} onChange={this.userIdChange.bind(this)} /> 
                        <br/><br/>
                            <button onClick={this.verifyIdentity.bind(this)}>
                                <h3>Verify Identity</h3>
                            </button>
                            {this.state.statusIdentity}
                    </span>
                </div>
             </div>
        </li>
    );

  }
} 
