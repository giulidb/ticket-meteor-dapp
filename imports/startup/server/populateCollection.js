/* Starting script to add records to the collections */

import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events.js';
import { transport } from '../../api/transport.js';

var event1 = Events.find({name: "Arcade Fire"}).count();

if(event1 == 0){

                Meteor.call('events.insertEvent',"Arcade Fire","concert","  Gli Arcade Fire tornano in Italia a tre anni dall’ultimo trionfale tour del precedente album “The Reflektor”.",
                "Ippodromo del Visarno, Firenze","tue, 18/07/17, 21.00");

}

var event2 = Events.find({name: "Eddie Vedder"}).count();

if(event2 == 0){

                Meteor.call('events.insertEvent',"Eddie Vedder","concert","Frontman dei Pearl Jam dal 1990, Eddie Vedder ha pubblicato da solista la meravigliosa colonna sonora del film “Into the Wild” nel 2007, e ha vinto un Golden Globe per il brano “Guaranteed” nel 2011; nel 2012 il suo “Ukulele Songs” ha ricevuta la nomination per Best Folk Album ai Grammy Awards.",
                "Ippodromo del Visarno, Firenze","tue, 24/06/17, 21.00");

}

var event3 = Events.find({name: "Turandot"}).count();

if(event3 == 0){

                Meteor.call('events.insertEvent',"Turandot","opera"," Dramma lirico in 3 atti di Giacomo Puccini,va in scena Turandot nell’applaudito allestimento creato per il Festival 2010 a firma di Franco Zeffirelli.",
                "Arena di Verona","sun, 23/07/17, 21.00");

}

var transport1 = transport.find({}).count();

if(transport1 == 0){
                Meteor.call('contracts.insertRegister', "Transport");
}