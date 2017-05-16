import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Ethereum_Accounts = new Mongo.Collection('ethereumAccounts');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('allAccounts', function() {
        return Ethereum_Accounts.find();
    });
}

//methods
Meteor.methods({

    'account.insert'() {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.insert({owner: Meteor.userId()});
    },

    'account.addAddress' (address) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.update({ owner: Meteor.userId() }, {
            $push: {
                addressList: {
                    address: address,
                    active: false
                }
            }
        });
    },

    'account.activateAddress' (address) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.update({ owner: Meteor.userId(), "addressList.address": address }, {
            $set: { "addressList.$.active": true }
        });
    }

});