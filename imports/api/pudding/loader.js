import Web3 from 'web3';
import web3 from '../ethereum/web3.js';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import userregistry_artifacts from '../ethereum/truffle/build/contracts/userRegistry.json';
import event_artifacts from '../ethereum/truffle/build/contracts/Event.json'

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
Event.deployed().then(function(instance){
  event = instance;
  return event.addTickets("Posto Unico in Piedi",5,100,{from: fromAddr,gasPrice: gasPrice, gas: gas}).then(function(){
      console.log("Tickets added");
  }).catch(function(e){
    console.log(e);
  })
}).catch(function(e){
    console.log(e);
});
