import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Contracts } from '../../api/contracts.js';
import Contract from '../Contract.jsx';

// Import libraries
import Web3 from '../../api/ethereum/web3.js';


// Import contract artifacts and turn them into usable abstractions.
//import Conference_artifacts from '../api/ethereum/truffle/build/contracts/Conference.json'
//import { default as contract } from 'truffle-contract'

// App component - represents the whole app
export default class EventWrapper extends TrackerReact(Component) {

  constructor(){
    super();

    this.state = {
      subscription: {
        contracts: Meteor.subscribe('allContracts')
      }
    }

    

  }

  componentWillUnmount(){
    this.state.subscription.contracts.stop();

  }

  contracts(){
    return Contracts.find({}).fetch();
  }
  
  renderContracts() {


      // Conference is an usable abstraction.
    /*var Conference = contract(Conference_artifacts);
    Conference.setProvider(web3.currentProvider);


    Conference.deployed().then(function(instance) {

    }).then(function(value) {
        console.log("Conference deployed");



    }).catch(function(e) {
        console.log(e);
    });*/
        return this.contracts().map((contract) => (

      <Contract key={contract._id} contract={contract} />

    ));
}


  render() {
     
    if(!this.state.subscription.contracts.ready)
        <div>Loading...</div>
    return (
          <ReactCSSTransitionGroup
             component="div"
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <ul className="dapp-account-list">
                 {this.contracts().map((contract)=>{
                  return <Contract key={contract._id} contract = {contract}/>
                  }
                 )}
             </ul> 
         </ReactCSSTransitionGroup>

    );
  }
}
