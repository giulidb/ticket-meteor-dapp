import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Events } from '../../api/events.js';
import Event from '../Event.jsx';


export default class EventWrapper extends TrackerReact(Component) {

  constructor(){
    super();

    this.state = {
      subscription: {
        events: Meteor.subscribe('allEvents'),
      }
    }
  }


  componentWillUnmount(){
    this.state.subscription.events.stop();

  }


  events(){
    return Events.find({}).fetch();
  }
  


  render() {
          
    return (
          <ReactCSSTransitionGroup
             component="div"
             className = {this.events().length == 0 ? "loader" : ""}
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <h1>Events List</h1>
             <p>This is the list of all the available events.</p>
             <br/><hr/>
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