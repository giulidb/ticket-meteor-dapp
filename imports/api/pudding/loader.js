import Web3 from 'web3';
import web3 from '../ethereum/web3.js';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import userregistry_artifacts from '../ethereum/truffle/build/contracts/userRegistry.json';
import event_artifacts from '../ethereum/truffle/build/contracts/Event.json'

import { Meteor } from 'meteor/meteor';


const provider = new Web3.providers.HttpProvider('http://localhost:8545')

// Transactions Parameters
const fromAddr = web3.eth.coinbase;
const gasPrice = 100000000000;
const gas = 2500000;

// Usable contrac abstractions
var userRegistry = contract(userregistry_artifacts);
userRegistry.setProvider(provider);
var Event = contract(event_artifacts);
Event.setProvider(provider);

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
userRegistry.deployed().then(function(instance){
  user = instance;
  return user.giveRightToUse(account, {from: fromAddr, gasPrice: gasPrice, gas: gas}).then(function() {
      console.log("Transaction complete!");
      user.getRight.call(account, {from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(value){
                   console.log("right of" + account +": "+value);
                  });
      }).catch(function(e){
        console.log(e);
      })

    }).catch(function(e) {
      console.log(e);
    });

var event;
var ticketPrice1 = web3.toWei(0.5,'ether');
var ticketPrice2 = web3.toWei(1,'ether');
var ticketPrice3 = web3.toWei(1.5,'ether');


var eventTimestamp = 1498338000; // 06/24/2017 @9:00pm (UTC)
Event.new("ArcadeFire Concert",eventTimestamp,4,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(instance1){
  console.log(instance1.address);
  Event.at(instance1.address).then(function(inst){
  Meteor.call('events.addAddress',"Arcade Fire",inst.address);
     inst.addTickets("Posto Unico in Piedi",ticketPrice1,200,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(res){
      inst.addTickets("Tribuna Primo Settore",ticketPrice2,100,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(value){
              inst.addTickets("Tribuna Secondo Settore",ticketPrice3,150,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(value){
                  console.log("Tickets added");
              });

      });
     });
  }).catch(function(e){
    console.log(e);
  });
}).catch(function(e){
    console.log(e);
});


var ticketPrice4 = web3.toWei(1.8,'ether');

Event.new("Eddie Vedder Concert",eventTimestamp,4,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(instance2){
  console.log(instance2.address);
  Event.at(instance2.address).then(function(inst2){
  Meteor.call('events.addAddress',"Eddie Vedder",inst2.address);
     inst2.addTickets("Posto Unico in Piedi",ticketPrice1,200,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(res){
      inst2.addTickets("Tribuna Primo Settore",ticketPrice2,100,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(value){
              inst2.addTickets("Stage Right Inner PIT up-grade",ticketPrice4,150,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(value){
                  console.log("Tickets added");
              });

      });
     });
  }).catch(function(e){
    console.log(e);
  });
}).catch(function(e){
    console.log(e);
});