import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import EthereumAccounts from '../EthereumAccounts.jsx';

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import userRegistry_artifacts from '../../api/ethereum/truffle/build/contracts/userRegistry.json'
 

export default class AccountsSettings extends TrackerReact(Component) {

  constructor(){
    super();
      this.state = {

        subscription: {
            accounts: Meteor.subscribe('allAccounts')
                      },
        rightVal: "",
     }
  }

    async componentWillMount() {
        //this.userRegistry = await selectContractInstance(userRegistry_artifacts);

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
        //let self = this;
        //const RightResp = await this.userRegistry.getRight.call(self.props.account.address);
        //const Right = mapReponseToJSON(RightResp,"","");
        //return Right;
  }




  accounts(){
        EthAccounts.init();
        return EthAccounts.find({},{sort:{name: +1}}).fetch();      
  }

  selectAccount(e){
        Session.set('account',e.target.name);

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
                    return(<li key = {account._id}>
                                <div className="row clear">
                                    <div className="col col-5 tablet-col-11 mobile-col-1-2">
                                        <span className="no-tablet no-mobile">
                                             <button className = {Session.get('account') == account.address ? "selected" : ""}
                                                  name = {account.address}
                                                  onClick = {this.selectAccount.bind(this)}>
                                                  <a className="dapp-identicon dapp-small" //style={{backgroundImage: url(identiconimage.png)}}
                                                  ></a>
                                                    <EthereumAccounts key={account._id} account = {account}/>
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
                           </li>);}      
                  )
                 }
             </ul> 
             
         </ReactCSSTransitionGroup>

    );
  }
}
