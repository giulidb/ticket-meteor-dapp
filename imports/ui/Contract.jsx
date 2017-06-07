import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import transport_artifacts from '../api/ethereum/truffle/build/contracts/Transport.json'
import event_artifacts from '../api/ethereum/truffle/build/contracts/Event.json'

export default class Contract extends TrackerReact(Component) {

 constructor(){
    super();

    this.state = {
        userAddress: 'User Address: ',
        userId: 'User Id',
        account: "",
        gasPrice: 100000000000,
        gas: 2500000,
        status: ""

    }
 }

componentWillMount(){
 this.setState({account: web3.eth.coinbase});
}

async verifyIdentity(){
    var verified;
    if(this.props.type == "Event"){
        this.Event = await selectContractInstance(event_artifacts,this.props.contract.address);
        verified = this.Event.verifyIdentity.call(this.state.userAddress,this.state.userId);
     }else{
        this.Transport = await selectContractInstance(transport_artifacts,this.props.contract.address);
        verified = this.Event.verifyIdentity.call(this.state.userAddress,this.state.userId);
   }
   if(verified)
        this.setState({status: "Identity verified"});
   else       
        this.setState({status: "Identity not verified"});

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

userAddressChange(e){
         this.setState({userAddress: e.target.value});
}

userIdChange(e){
         this.setState({userAddress: e.target.value});
}



   render() {

    console.log(this.props.contract);
    var wei = web3.eth.getBalance(this.props.contract.address);

    console.log(wei);
        return (
                
            <li><hr/><div className="row clear">
                <div className="col col-4 tablet-col-11 mobile-col-1-2">
                    <span className="no-tablet no-mobile">
                                    <h3>Contract Name: {this.props.contract.name}</h3>
                                    <span>Contract Address: <br/>{this.props.contract.address} </span><br/>
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
                            {this.state.status}
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                       
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <h1></h1>
                </div>
                
               <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                            <button onClick={this.withdraw.bind(this)}>
                                <h3>Withdraw Revenue</h3>
                                <span>Contract Balance: {/*web3.fromWei(wei,'ether')} ETH 
                                    / {EthTools.formatBalance(wei, '0.00', 'eur')*/}€ </span>
                            </button>
                    </span>
                </div>

             </div>
        </li>
    );

  }
} 
