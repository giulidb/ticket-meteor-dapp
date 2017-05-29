import Web3 from 'web3';
import { transport } from '../../api/transport.js'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import userregistry_artifacts from '../../api/ethereum/truffle/build/contracts/userRegistry.json';
import event_artifacts from '../../api/ethereum/truffle/build/contracts/Event.json';
import transport_artifacts from '../../api/ethereum/truffle/build/contracts/Transport.json';


import { Meteor } from 'meteor/meteor';


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

console.log(provider);
// Transactions Parameters
const fromAddr = web3.eth.coinbase;
const gasPrice = 100000000000;
const gas = 2500000;

// Usable contrac abstractions
var userRegistry = contract(userregistry_artifacts);
userRegistry.setProvider(provider);
var Event = contract(event_artifacts);
Event.setProvider(provider);
var Transport = contract(transport_artifacts);
Transport.setProvider(provider);

// Load Accounts
var accounts;
var account;
web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
    }

    if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
    }

    accounts = accs;
    account = accounts[1];
});

// Initialize contracts
var user;
/*var userRegistryAddress;
userRegistry.new({ from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(instance) {
    user = instance;
    userRegistryAddress = instance.address;
    //Meteor.call('register.insertRegister', "UserRegister");
    Meteor.call('register.updateAddress', "UserRegister", userRegistryAddress);
    return user.giveRightToUse(account, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function() {
        console.log("Transaction complete!");
        user.getRight.call(accounts[2], { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
            console.log("right of" + account + ": " + value);
        });
    }).catch(function(e) {
        console.log(e);
    })

}).catch(function(e) {
    console.log(e);
});*/

var event;
var ticketPrice1 = web3.toWei(0.70, 'ether');
var ticketPrice2 = web3.toWei(0.90, 'ether');
var ticketPrice3 = web3.toWei(1.40, 'ether');

console.log("ticket price: " + ticketPrice1);
var eventTimestamp = 1498338000; // 06/24/2017 @9:00pm (UTC)
Event.new("ArcadeFire Concert", eventTimestamp, 4, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(instance1) {
    console.log(instance1.address);
    Event.at(instance1.address).then(function(inst) {
        Meteor.call('events.addAddress', "Arcade Fire", inst.address);
        inst.addTickets("Posto Unico in Piedi", ticketPrice1, 200, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(res) {
            inst.addTickets("Tribuna Primo Settore", ticketPrice2, 100, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                inst.addTickets("Tribuna Secondo Settore", ticketPrice3, 150, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                    console.log("Tickets added");
                });

            });
        });
    }).catch(function(e) {
        console.log(e);
    });
}).catch(function(e) {
    console.log(e);
});


var ticketPrice4 = web3.toWei(1.83, 'ether');

Event.new("Eddie Vedder Concert", eventTimestamp, 4, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(instance2) {
    console.log(instance2.address);
    Event.at(instance2.address).then(function(inst2) {
        Meteor.call('events.addAddress', "Eddie Vedder", inst2.address);
        inst2.addTickets("Posto Unico in Piedi", ticketPrice1, 200, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(res) {
            inst2.addTickets("Tribuna Primo Settore", ticketPrice2, 100, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                inst2.addTickets("Stage Right Inner PIT up-grade", ticketPrice4, 150, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                    console.log("Tickets added");
                });

            });
        });
    }).catch(function(e) {
        console.log(e);
    });
}).catch(function(e) {
    console.log(e);
});


Event.new("Turandot", eventTimestamp, 4, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(instance3) {
    console.log(instance3.address);
    Event.at(instance3.address).then(function(inst3) {
        Meteor.call('events.addAddress', "Turandot", inst3.address);
        inst3.addTickets("Poltrone", web3.toWei(1.99, 'ether'), 100, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(res) {
            inst3.addTickets("Poltroncina di Gradinata", web3.toWei(1.83, 'ether'), 150, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                inst3.addTickets("Tribuna - Settore D", web3.toWei(0.83, 'ether'), 200, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                    inst3.addTickets("Tribuna - Settore C", web3.toWei(0.75, 'ether'), 350, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(value) {
                        console.log("Tickets added");
                    });
                });
            });
        });
    }).catch(function(e) {
        console.log(e);
    });
}).catch(function(e) {
    console.log(e);
});

var maxTimestamp = 1800; //01/01/1970 @ 12:30am (UTC) added to current timestamp is equivalent to add 30 min
var depositQuota = web3.toWei(0.0032, 'ether');
Transport.new("Trenitalia", depositQuota, maxTimestamp, { from: fromAddr, gasPrice: gasPrice, gas: gas }).then(function(instance4) {
    console.log(instance4.address + " Transport contract deployed");
    // Meteor.call('contracts.insertRegister', "Transport");
    Meteor.call('contracts.updateAddress', "Transport", instance4.address);

}).catch(function(e) {
    console.log(e);
});