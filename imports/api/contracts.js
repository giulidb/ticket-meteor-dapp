import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Contracts = new Mongo.Collection('contracts');

if(Meteor.isServer){
    // this code only runs on the server
    Meteor.publish('allContracts', function(){
        return Contracts.find();
    });
}