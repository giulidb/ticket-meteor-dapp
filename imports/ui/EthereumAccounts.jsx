
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Import Components
import { Ethereum_Accounts } from '../api/ethereum_accounts.js';
import  userValue  from './userValue.jsx';



// Ethereum libraries and contracts
import Web3 from '../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'



var Registry = contract(userRegistry_artifacts);
Registry.setProvider(web3.currentProvider);

// Contract component - represents a single todo item
export default class EthereumAccounts extends TrackerReact(Component) {


   constructor(props){
    super(props);

    this.state = {
      subscription: {
        accounts: Meteor.subscribe('allAccounts'),
      },
      val:''

    }

    this.handleUserRegistry = this.handleUserRegistry.bind(this);
  } 

  componentDidMount(){
      this.handleUserRegistry(this.props.account.address);
  }

  componentWillUnmount(){
    this.state.subscription.accounts.stop();

  } 

   accounts(){
    return Ethereum_Accounts.findOne({address: this.props.account.address});
  }

  async handleUserRegistry(addr) {
    var that = this;
   console.log("handle");
    //const reg = await Registry.deployed();
    const reg = await Registry.at("0x73CB9365F12f33fFbFfA5f3eD3FEd7699b7F760A").then(
      function(instance){
             instance.owner.call().then(function(value){
               console.log("owner address: " + value );
             
             return instance.giveRightToUse.call(addr, {from: "0x12366608B3DBcE8A7bdc7aCc0b520b31dd29C187"}).then(
               function(result){
                 console.log("Transaction complete!");
                 instance.getRight.call(addr).then(
                   function(value){
                      console.log(value);
                   }
                 );
               }
            )
            });
      }
    ).catch(function(e){console.log(e)});
  }


  render() {

      let val = this.state.val;
      console.log(val);

      return (
         

          <li>
          <button>
                <a className="dapp-identicon dapp-small"></a>
                <h3>{this.props.account.name}</h3>
                <span>{this.props.account.address}</span>
                <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                      /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
                </span> 
          </button>   
          
          </li>
           

        );
      
      }
    
  }

    
  
