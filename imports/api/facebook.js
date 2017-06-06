import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';


if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.methods({

        'getFacebookId' (){
            if(Meteor.userId()){
                console.log(Meteor.users.findOne({_id: Meteor.userId()}));
                console.log( Meteor.users.findOne({_id: Meteor.userId()}).services.facebook.id);
                return Meteor.users.findOne({_id: Meteor.userId()}).services.facebook.id;
            }
        }
    });
}