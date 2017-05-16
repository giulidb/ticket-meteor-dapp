
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Import Components
import { Ethereum_Accounts } from '../api/ethereum_accounts.js';
import  userRegistry  from './userRegistry.jsx';

import { Meteor } from 'meteor/meteor';


// Ethereum libraries and contracts

import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import { default as contract } from 'truffle-contract'
import userRegistry_artifacts from '../api/ethereum/truffle/build/contracts/userRegistry.json'

// Contract component - represents a single todo item
export default class EthereumAccounts extends TrackerReact(Component) {


   constructor(){
    super();

    this.state = {
      subscription: {
        accounts: Meteor.subscribe('allAccounts')
      },
      rightVal: ""
    }
  }

  async componentWillMount() {
    this.userRegistry = await selectContractInstance(userRegistry_artifacts);

    const right = await this.getRight();
    this.setState( {rightVal: right} );
        console.log(this.state.rightVal);

}



  componentWillUnmount(){
    this.state.subscription.accounts.stop();

  } 

   accounts(){
    console.log("accounts query: " + Ethereum_Accounts.findOne({owner: Meteor.userId()}));
    return Ethereum_Accounts.findOne({owner: Meteor.userId()});
  }

  async getRight(){
    let self = this;
    const RightResp = await this.userRegistry.getRight.call(self.props.account.address);
    const Right = mapReponseToJSON(RightResp,"","");
    return Right;
  }

  activate(){
    console.log("Activate function: " + this.props.account.address );
    
    // check if user with Meteor.userId is already in the db
    // if not insert it and add the correspondent address else
    // only update with the new address.
    if(!this.accounts()){
              console.log("Insert new account");
              Meteor.call('account.insert');}
    console.log("Update new account");          
    Meteor.call('account.addAddress',this.props.account.address);
    Bert.alert('Congratulations! Your request has been successful!','success','growl-top-right','fa-smile-o');

    
  }



  render() {

      var active;
      if(this.state.rightVal != null)
         active = this.state.rightVal ? "Activated" : "Inactive";
      var buttonClass = this.state.rightVal ? "selected": ""; 

      return (

          <li>
            <div className="row clear">
               <div className="col col-5 tablet-col-11 mobile-col-1-2">
                    <span className="no-tablet no-mobile">
                        <button className = {buttonClass}>
                          <a className="dapp-identicon dapp-small"></a>
                          <h3>{this.props.account.name}</h3>
                          <span>{this.props.account.address}</span>
                          <span>{EthTools.formatBalance(this.props.account.balance, '0.0,[0] unit', 'ether')}
                                /{EthTools.formatBalance(this.props.account.balance, '0.0,[0]', 'eur')}€
                          </span> 
                        </button>       
                    </span>
              </div>
            

             <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                            <button disabled = {this.state.rightVal} onClick={this.activate.bind(this)} >
                                <h3>Activate This Account</h3>
                                 Account Status: {active}
                            </button>
                    </span>
                </div>  
            </div>                    
          </li>
          

        );
      
      }
    
  }

    
  
