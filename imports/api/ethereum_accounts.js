import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import userRegistry_artifacts from './ethereum/truffle/build/contracts/userRegistry.json'
import web3 from './ethereum/web3.js';
import { default as contract } from 'truffle-contract'


// Transactions Parameters
const fromAddr = web3.eth.coinbase;
const gasPrice = 100000000000;
const gas = 2500000;
var provider = new Web3.providers.HttpProvider('http://localhost:8545');

// Usable contrac abstractions
var userRegistry = contract(userRegistry_artifacts);
userRegistry.setProvider(provider);

export const Ethereum_Accounts = new Mongo.Collection('ethereumAccounts');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('allAccounts', function() {
        return Ethereum_Accounts.find();
    });
}

//methods
Meteor.methods({

    'account.insert' () {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.insert({ owner: Meteor.userId() });
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
                    active: "Inactive"
                }
            }
        });
    },

    'account.pendingAddress' (address) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.update({ owner: Meteor.userId(), "addressList.address": address }, {
            $set: { "addressList.$.active": "pending" }
        });
    },

    'account.activateAddress' (address) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Ethereum_Accounts.update({ owner: Meteor.userId(), "addressList.address": address }, {
            $set: { "addressList.$.active": "Active" }
        });
    },

    'giveRight' (contractAddress, userAddress) {
        userRegistry.at(contractAddress).then(function(instance) {
            var user = instance;
            return user.giveRightToUse(userAddress, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function() {
                console.log("Transaction complete!");
                user.getRight.call(userAddress, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                    console.log("right of" + userAddress + ": " + value);
                });
            }).catch(function(e) {
                console.log(e);
            })

        }).catch(function(e) {
            console.log(e);
        });
    }

});