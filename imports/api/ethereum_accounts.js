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