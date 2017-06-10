import { Meteor } from 'meteor/meteor';

// Ropsten addresses
var event1Address = "0x32e6784d19835b7407e449b5caed401438ca396b";
var transportContractAddress = "0xcffb1bbf5c1fbb84d197e8bc3cdd0976ead0e402";
Meteor.call('events.addAddress', "Arcade Fire", event1Address);
Meteor.call('contracts.updateAddress', "Transport", transportContractAddress);
