import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import EthereumAccounts from '../EthereumAccounts.jsx';

import TrackerReact from 'meteor/ultimatejs:tracker-react';

// Components
import { Meteor } from 'meteor/meteor';
import {UserRegister} from '../../api/userRegister.js';
import { Ethereum_Accounts } from '../../api/ethereum_accounts.js';

// Ethereum lib
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import userRegistry_artifacts from '../../api/ethereum/truffle/build/contracts/userRegistry.json'
 

export default class AccountsSettings extends TrackerReact(Component) {

  constructor(){
    super();
      this.state = {

        subscription: {
            accounts: Meteor.subscribe('allAccounts'),
            register: Meteor.subscribe('registerAddress'),
                      }
     }
  }


  componentWillUnmount(){
        this.state.subscription.accounts.stop();
        this.state.subscription.register.stop();

  } 


   account(){
        console.log("accounts query: " + Ethereum_Accounts.findOne({owner: Meteor.userId()}));
        return Ethereum_Accounts.findOne({owner: Meteor.userId()});
  }

  accounts(){
        EthAccounts.init();
        return EthAccounts.find({},{sort:{name: +1}}).fetch();      
  }

  selectAccount(e){
        Session.set('account',e.target.name);

  }

  getRegAddress(){
      return UserRegister.find({}).fetch();
  }

    activate(addr){
            console.log("Activate function: " + addr );
            
            // check if user with Meteor.userId is already in the db
            // if not insert it and add the correspondent address else
            // only update with the new address.
            if(!this.account()){
                      Meteor.call('account.insert');}        
            Meteor.call('account.addAddress',addr);
            
            // Simulate server Transaction
            Meteor.call('giveRight',Session.get("reg_address"),addr);
            Bert.alert('Congratulations! Your request has been successful!','success','growl-top-right','fa-smile-o');

    
  }

  render() {

    if(!this.state.subscription.register.ready)
        return(
            <div className="loader">Loading...</div>
          )
     
     var reg = this.getRegAddress();
     if(reg.length > 0){  
              
               Session.set("reg_address",reg[0].address);
               console.log(Session.get("reg_address"));

     }
 
    return (
          <ReactCSSTransitionGroup
             component="div"
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <h1>My Accounts List</h1>
             <p>This is the list of your Ethereum connected account, pick one of them to use in this dapp.</p>
             <ul className="dapp-account-list">
                 {this.accounts().map((account)=>{
                    return(
        
                        <li key = {account._id}>
                                <div className="row clear">
                                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                                        <span className="no-tablet no-mobile">
                                             <button className = {Session.get('account') == account.address ? "selected" : ""}
                                                  name = {account.address}
                                                  onClick = {this.selectAccount.bind(this)}>
                                                  <a className="dapp-identicon dapp-small" //style={{backgroundImage: url(identiconimage.png)}}
                                                  ></a>
                                                    <EthereumAccounts key={account._id} account = {account} ref="acc"/>
                                              </button>
                                        </span>
                                    </div>
                                    <div className="col col-3 tablet-col-1 mobile-full">
                                        <span className="no-tablet no-mobile">
                                                <button disabled = {this.state.rightVal} onClick={this.activate.bind(this,account.address)} >
                                                    <h3>Activate This Account</h3>
                                                    Account Status: {Session.get(account.address) ? "Activated" : "Inactive"}
                                                </button>
                                       </span>
                                  </div> 
                                </div>                     
              </li>);}      
                  )
                 }
             </ul> 
             
         </ReactCSSTransitionGroup>

    );
  }
}
