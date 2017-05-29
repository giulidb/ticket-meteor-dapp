import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const transport = new Mongo.Collection('contracts');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('contractAddress', function() {
        return transport.find();
    });


    //methods
    Meteor.methods({

        'contracts.insertRegister' (_name, addr) {
            transport.insert({
                name: _name,
                address: addr
            });
        },

        'contracts.updateAddress' (_name, addr) {

            transport.update({ name: _name }, {
                $set: { address: addr }
            });
        }




    });

}