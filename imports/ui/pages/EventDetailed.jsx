import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Events } from '../../api/events.js';
import Event from '../Event.jsx';

import {Meteor} from 'meteor/meteor';

export default class EventDetailed extends TrackerReact(Component){
  
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

   contract(){
    return Events.findOne(new Meteor.Collection.ObjectID(this.props.id));
  }

    render(){

        let event = this.contract();
        if(!event)
          return(<div>Loading...</div>)
        

        return(
                <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                
                  <h1>{event.name}</h1>
                  <h3>{event.location} - {event.date}</h3>
                  <p>{event.description}</p>
                  
                </ReactCSSTransitionGroup>
                
        )
    }

}