import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Events } from '../../api/events.js';
import {transport} from '../../api/transport.js'
import Contract from '../Contract.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Meteor} from 'meteor/meteor'

export default class Admin extends TrackerReact(Component){

    constructor(){
        super();

        this.state = {
        subscription: {
            events: Meteor.subscribe('allEvents'),
            contract: Meteor.subscribe('contractAddress')
            }
        }
    }

    async getBalance(){
        if(Session.get('coinbase')){
                var balance = await web3.eth.getBalance(Session.get('coinbase')).valueOf();
                Session.set('ownerBalance',balance);}
     }

    componentWillUnmount(){
        this.state.subscription.events.stop();
        this.state.subscription.contract.stop();
  }

    getTransportContract(){
        return transport.find({}).fetch();
  }

    getEventContract(){
        return Events.find({}).fetch();
  }

    render(){
    
        var transportContract = this.getTransportContract()[0];
        
        if(!transportContract)
            return <div className = "loader" ></div>
        
        this.getBalance();
        var balance = !(Session.get('ownerBalance')) ? 0 : Session.get('ownerBalance');
   
        return(
                    <ReactCSSTransitionGroup
                    component="div"
                    transitionName="route"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    transitionAppear={true}
                    transitionAppearTimeout={500}>
                        <h1>Contracts Resume</h1>
                        <ul className="dapp-account-list">
                            <li><a className="dapp-identicon dapp-small" href=""></a>
                                    <h3>Owner Account</h3>
                                    <span>{Session.get('coinbase')}</span><br/>
                                    <span>{EthTools.formatBalance(Session.get('ownerBalance'), '0.00 unit', 'ether')}
                                    / {EthTools.formatBalance(Session.get('ownerBalance'), '0.00', 'eur')} €</span>
                            </li>
                        </ul>

                        <br/><hr/><br/>
                        
                        <h1>Contracts Deployed</h1>
                        <ul className="dapp-account-list">
                            {this.getEventContract().map((contract)=>{
                                    return <Contract key={contract._id} contract = {contract} type="Event"/>
                                    })}
                            <Contract key={transportContract._id} contract = {transportContract} type="Transport"/>
                        </ul> 
                    </ReactCSSTransitionGroup>
                
        )
    }

}