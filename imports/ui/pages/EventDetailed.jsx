import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Contracts } from '../../api/contracts.js';
import Contract from '../Contract.jsx';

import {Meteor} from 'meteor/meteor';

export default class EventDetailed extends TrackerReact(Component){
  
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

   contract(){
    return Contracts.findOne(new Meteor.Collection.ObjectID(this.props.id));
  }

    render(){

        let event = this.contract();
        if(!event){
          return(<div>Loading...</div>)
        }

        return(
                <div>{event.address}</div>
                
        )
    }

}