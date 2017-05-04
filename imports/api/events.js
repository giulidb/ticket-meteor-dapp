import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('allEvents', function() {
        return Events.find();
    });
}