import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import '../../api/pudding/loader.js';

import EthereumAccounts from '../EthereumAccounts.jsx';



export default class AccountsSettings extends Component {


  accounts(){
    EthAccounts.init();
    return EthAccounts.find({},{sort:{name: +1}}).fetch();      
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
             <h1>My Accounts List</h1>
             <userRegistry/>
             <ul className="dapp-account-list">
                 {this.accounts().map((account)=>{
                  return <EthereumAccounts key={account._id} account = {account}/>
                  }
                 )}
             </ul> 
<<<<<<< HEAD
             
=======
>>>>>>> e533caff6526fa8bff05dc1de7b70d1f0e8af4fd
         </ReactCSSTransitionGroup>

    );
  }
}
