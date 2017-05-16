import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('allEvents', function() {
        return Events.find();
    });


//methods
Meteor.methods({

    'events.insertEvent'(_name,_type,_description,_location,_date) {
          Events.insert({
                name: _name,
                description: _description,
                type: _type,
                location: _location,
                date: _date

        });
    },

    'events.addAddress'(_name,addr) {

        Events.update({ name: _name}, {
            $set: { address: addr }
        });
    }

});

}