import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NumericInput from 'react-numeric-input';

// Components
import { Meteor } from 'meteor/meteor';

// Ethereum lib
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
 

export default class AccountsSettings extends Component {

    constructor(){
        super();

        this.state = {
             subscription: {
            accounts: Meteor.subscribe('allAccounts')},
            eur: '0',
            eth: '0',
            fee: '0',
            total: '0'

        }
        
  }

    componentWillUnmount(){
        this.state.subscription.accounts.stop();
  } 

    convertEur(){
            console.log( EthTools.formatBalance(EthTools.toWei(this.refs.Eur.state.value,"eur"),'ether'));
            var eur = this.refs.Eur.state.value;
            this.refs.Eth.value = EthTools.formatBalance(EthTools.toWei(eur,"eur"),'0.00','ether');
            var fee = eur * 0.02
            this.refs.fee.value = fee;
            this.refs.total.value = eur + fee;

    }

    buy(){
        console.log(this.refs.total.value);
        // Simulate server Transaction
        console.log(EthAccounts.findOne({address: Session.get('account')}));
        Meteor.call('sendEther',Session.get('account'),EthTools.toWei(this.refs.total.value,"eur"));
        Bert.alert('Congratulations! Ethers bought correctly','success','growl-top-right','fa-smile-o');
        console.log("Account: "+Session.get('account')+" balance: ");
        console.log(EthAccounts.findOne({address: Session.get('account')}));
        console.log(EthAccounts.find({}).fetch());

    }

    render() {
 
       return (
          <ReactCSSTransitionGroup
             component="div"
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <h1>Exchange</h1>
             <p>Buy Ethers with our exchange Eur/Eth service </p>
             <form>
                 
                 <div className="row clear">
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <h3>Eur:</h3> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <NumericInput ref='Eur' precision={2} min={0} className='form-control' value = {0} onChange={this.convertEur.bind(this)}/>
                        </span>
                    </div>    
                 </div>
                 <br/>
                  <div className="row clear">
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <h3>Eth:</h3> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <input ref="Eth" className='form-control' value = {this.state.fee} disabled={true}/>
                        </span>
                    </div>    
                 </div>
                 <br/>
                 <div className="row clear">
                     <hr/>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <h3>2% fee in Eur:</h3> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <input ref="fee" className='form-control' value = {this.state.fee} disabled={true}/>
                        </span>
                    </div>    
                 </div>
                 <br/>
                 <div className="row clear">
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <h3>Total in eur:</h3> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <input ref="total" className='form-control' value = {this.state.total} disabled={true}/>
                        </span>
                    </div>    
                 </div>
                  </form> 
                 <br/>
                 <div className="row clear">
                     <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <h3></h3>
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <input type="submit" value="Buy" onClick ={this.buy.bind(this)}/>
                        </span>
                    </div>      
                 </div>   
                 <br/><br/><hr/>
                 
         </ReactCSSTransitionGroup>

    );
  }
}
