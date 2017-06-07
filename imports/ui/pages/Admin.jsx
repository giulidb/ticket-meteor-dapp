import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Events } from '../../api/events.js';
import Contract from '../Contract.jsx'

export default class Admin extends Component{

    constructor(){
        super();

        this.state = {
        subscription: {
            events: Meteor.subscribe('allEvents'),
            contract: Meteor.subscribe('contractAddress')
            }
        }
    }

    componentWillUnmount(){
        this.state.subscription.events.stop();
        this.state.subscription.contract.stop();
  }

    account(){
       EthAccounts.init(); 
       return EthAccounts.findOne({address: web3.eth.coinbase});
    }

    getContract(){
    return Events.find({}).fetch();
  }

    render(){
    
     var account = this.account();

     return(
                <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                    <h1>Admin Dashboard</h1>
                    <ul className="dapp-account-list">
                    <li><a className="dapp-identicon dapp-small" href=""></a>
                            <h3>Owner Account</h3>
                            <span>{account.address}</span><br/>
                            <span>{EthTools.formatBalance(account.balance, '0.00 unit', 'ether')}
                            / {EthTools.formatBalance(account.balance, '0.00', 'eur')} €</span>
                    </li>
                    </ul>

                    <br/>           
                    <hr/>
                    <br/>
                   
                    <h1>Contract Deployed</h1>
                    <ul className="dapp-account-list">
                        {this.getContract().map((contract)=>{
                            return <Contract key={contract._id} contract = {contract}/>
                            })}
                     
                     <li>
                     
                     </li>       
                   <hr/> 
                   </ul> 
                </ReactCSSTransitionGroup>
                
        )
    }

}