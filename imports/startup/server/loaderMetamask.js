import { Meteor } from 'meteor/meteor';

// Ropsten addresses
var event1Address = "0x020960bB2480Be790ea559eF746F57F3D451951d";
var event2Address = "0xddf5812a23cad7ee85805e7a1ce3bc03e0700e90";
var event3Address = "0xa13abe624cbc3425f1eb731c2dcc08156df6e5db";
var transportContractAddress = "0xac3cAdeA6Ecce3a7E653863e7EED2B7eE235AdDf";
Meteor.call('events.addAddress', "Arcade Fire", event1Address);
Meteor.call('events.addAddress', "Eddie Vedder", event3Address);
Meteor.call('events.addAddress', "Turandot", event2Address);
Meteor.call('contracts.updateAddress', "Transport", transportContractAddress);
