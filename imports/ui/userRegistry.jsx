import React, { Component } from 'react';

// Ethereum libraries and contracts
import Web3 from '../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'

export default class userRegistry extends Component {


    render() {

      /*  console.log("prova");
          // Conference is an usable abstraction.
    var userRegistry = contract(userRegistry_artifacts);
    userRegistry.setProvider(web3.currentProvider);
    var cont;

    userRegistry.at('0x497cfe6b4edbb60cb9123a36f15402d518df2c82').then(function(instance) {
      cont = instance;
      console.log(cont);
      cont.getRights.call("0x12366608B3DBcE8A7bdc7aCc0b520b31dd29C187").then(function(value) {

        console.log(value);
        return(
            <span>Value: {value}</span>
        );
        });    
        

    }).catch(function(e) {
        console.log(e);
    });*/
    console.log("buh");
    return(<h2>prova</h2>);

    }
}