import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const UserRegister = new Mongo.Collection('register');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('registerAddress', function() {
        return UserRegister.find();
    });


//methods
Meteor.methods({

    'register.insertRegister'(_name,addr) {
          UserRegister.insert({
                name: _name,
                address: addr
        });
    },

    'register.updateAddress'(_name,addr) {

        UserRegister.update({ name: _name}, {
            $set: { address: addr }
        });
    }

});

}