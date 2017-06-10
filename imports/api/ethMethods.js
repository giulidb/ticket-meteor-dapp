import { Meteor } from 'meteor/meteor';
import Web3 from 'web3';
import userRegistry_artifacts from './ethereum/truffle/build/contracts/userRegistry.json'
import transport_artifacts from './ethereum/truffle/build/contracts/Transport.json';
import { transport } from './transport.js';
import { default as contract } from 'truffle-contract'

var provider;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    provider = web3.currentProvider;
} else {
    // set the provider you want from Web3.providers
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
}

// Transactions Parameters
const fromAddr = web3.eth.coinbase;
const gasPrice =  100000000000;
const gas =  2500000;


Meteor.methods({

    'configureTicket' (ticketDescription, userAddr) {
        Meteor.setTimeout(function() {
            var addr = transport.find({}).fetch();
            var max_uses = (ticketDescription.ticketType == "10 Tickets Carnet") ? 10 : ((ticketDescription.ticketType == "Simple Ticket") ? 1 : "");

            var ticketType;
            switch (ticketDescription.ticketType) {
                case "Simple Ticket":
                    ticketType = 0;
                    break;
                case "10 Tickets Carnet":
                    ticketType = 1;
                default:
                    ticketType = 2;
            }

            var Transport = contract(transport_artifacts);
            Transport.setProvider(provider);
            var instance;

            Transport.at(addr[0].address).then(
                function(value) {
                    instance = value;
                    return instance.numTickets.call(userAddr).then(function(index) {
                        return instance.configureTicket(userAddr, ticketType,
                            index.valueOf() - 1, ticketDescription.expirationDate, max_uses, ticketDescription.price, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(res) {
                            console.log("Transaction configure ticket done!");
                        });
                    }).catch(function(e) {
                        console.log(e);
                    });
                }).catch(function(e) {
                console.log(e);
            });

        }, 60000);

    },

     'sendEther' (userAddress, amount) {
        Meteor.setTimeout(function() {
            web3.eth.sendTransaction({ from: fromAddr, to: userAddress, value: amount });
            console.log("from: " + fromAddr + " to: " + userAddress + " amount: " + amount);
         }, 60000);
    }

});
