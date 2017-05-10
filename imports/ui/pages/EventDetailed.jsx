import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Events } from '../../api/events.js';
import Event from '../Event.jsx';
import Ticket from '../Ticket.jsx';

import {Meteor} from 'meteor/meteor';

// Ethereum libraries and contracts

import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import event_artifacts from '../../api/ethereum/truffle/build/contracts/Event.json'

export default class EventDetailed extends TrackerReact(Component){
  
  constructor(){
    super();

    this.state = {
      subscription: {
        events: Meteor.subscribe('allEvents')
      },
       Tickets: []
    }
  }

    async componentWillMount() {
    this.TicketsList = await selectContractInstance(event_artifacts);

    const TicketItems = await this.getTickets();
    console.log(TicketItems);
    this.setState( {Tickets: TicketItems} );
    console.log(this.state.Tickets);

}

  componentWillUnmount(){
    this.state.subscription.events.stop();

  }

   contract(){
    return Events.findOne(new Meteor.Collection.ObjectID(this.props.id));
  }

    async getTickets(){
    const TicketItemsResp = await this.TicketsList.getTickets.call();
    const TicketItems = mapReponseToJSON(TicketItemsResp,['description','TicketPrices','ticketsLeft'],"arrayOfObject");
    return TicketItems;
  }


    render(){

        let event = this.contract();
        if(!event){
          return(<div>Loading...</div>)
        }

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
                  <h3>Tickets</h3>
                  <ul className="dapp-account-list">
                   {this.state.Tickets.map((item,itemIndex) => {
                       return <Ticket key={itemIndex} item = {item}/>
                      })
                    }
                   
                  </ul> 
                  
                </ReactCSSTransitionGroup>
                
        )
    }

}