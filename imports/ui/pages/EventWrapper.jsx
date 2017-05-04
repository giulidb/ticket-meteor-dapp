import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Events } from '../../api/events.js';
import Event from '../Event.jsx';

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
        events: Meteor.subscribe('allEvents')
      }
    }

    

  }

  componentWillUnmount(){
    this.state.subscription.events.stop();

  }

  events(){
    return Events.find({}).fetch();
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
     
}


  render() {
     
    if(!this.state.subscription.events.ready)
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
                 {this.events().map((event)=>{
                  return <Event key={event._id} event = {event}/>
                  }
                 )}
             </ul> 
         </ReactCSSTransitionGroup>

    );
  }
}
