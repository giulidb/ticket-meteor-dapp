
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Import Components
import { Ethereum_Accounts } from '../api/ethereum_accounts.js';
import  userRegistry  from './userRegistry.jsx';



// Ethereum libraries and contracts
import Web3 from '../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'

// Contract component - represents a single todo item
export default class EthereumAccounts extends TrackerReact(Component) {


   constructor(){
    super();

    this.state = {
      subscription: {
        accounts: Meteor.subscribe('allAccounts'),
        val: " "
      }
    }
  }

  componentDidMount(){

        var userRegistry = contract(userRegistry_artifacts);
        userRegistry.setProvider(web3.currentProvider);
        var cont;

        userRegistry.at('0x497cfe6b4edbb60cb9123a36f15402d518df2c82').then(function(instance) {
          cont = instance;
          console.log(cont);
          cont.getRights.call("0x12366608B3DBcE8A7bdc7aCc0b520b31dd29C187").then(function(value) {
            console.log(value);
                this.state ={
                  subscription: {val: value}
                }
            });    
            

        }).catch(function(e) {
            console.log(e);
        });
      

  }

  componentWillUnmount(){
    this.state.subscription.accounts.stop();

  } 

   accounts(){
    return Ethereum_Accounts.findOne({address: this.props.account.address});
  }

 


  render() {


      return (

          <li>
          <button>
                <a className="dapp-identicon dapp-small"></a>
                <h3>{this.props.account.name}</h3>
                <span>{this.props.account.address}</span>
                <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                      /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
                </span> 
                <span>{this.state.subscription.val}</span>
            </button>             
          </li>
          

        );
      
      }
    
  }

    
  
