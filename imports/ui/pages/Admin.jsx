import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Events } from '../../api/events.js';
import {transport} from '../../api/transport.js'
import Contract from '../Contract.jsx'

export default class Admin extends Component{

    constructor(){
        super();

        this.state = {
        subscription: {
            events: Meteor.subscribe('allEvents'),
            contract: Meteor.subscribe('contractAddress')
            }
        }
    }

    componentWillUnmount(){
        this.state.subscription.events.stop();
        this.state.subscription.contract.stop();
  }

    account(){
       EthAccounts.init(); 
       return EthAccounts.findOne({address: web3.eth.coinbase});
    }

    getTransportContract(){
        return transport.find({}).fetch();
  }

    getEventContract(){
    return Events.find({}).fetch();
  }

    render(){
    
     var account = this.account();
     var transportContract = this.getTransportContract[0];

     return(
                <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                    <h1>Admin Dashboard</h1>
                    <ul className="dapp-account-list">
                    <li><a className="dapp-identicon dapp-small" href=""></a>
                            <h3>Owner Account</h3>
                            <span>{account.address}</span><br/>
                            <span>{EthTools.formatBalance(account.balance, '0.00 unit', 'ether')}
                            / {EthTools.formatBalance(account.balance, '0.00', 'eur')} €</span>
                    </li>
                    </ul>

                    <br/>           
                    <hr/>
                    <br/>
                   
                    <h1>Contract Deployed</h1>
                    <ul className="dapp-account-list">
                        {this.getEventContract().map((contract)=>{
                            return <Contract key={contract._id} contract = {contract} type="Event"/>
                            })}
                     
                     <li>
                        <Contract key={transportContract._id} contract = {transportContract} type="Transport"/>
                     </li>       
                   <hr/> 
                   </ul> 
                </ReactCSSTransitionGroup>
                
        )
    }

}