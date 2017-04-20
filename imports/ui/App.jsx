import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Contracts } from '../api/contracts.js';

// Import libraries
import Web3 from '../api/ethereum/web3.js';

import Task from './Task.jsx';

// Import contract artifacts and turn them into usable abstractions.
import Conference_artifacts from '../api/ethereum/truffle/build/contracts/Conference.json'
import { default as contract } from 'truffle-contract'

// App component - represents the whole app
class App extends Component {
  
  renderTasks() {

      // Conference is an usable abstraction.
    var Conference = contract(Conference_artifacts);
    Conference.setProvider(web3.currentProvider);


    Conference.deployed().then(function(instance) {

    }).then(function(value) {
        console.log("Conference deployed");



    }).catch(function(e) {
        console.log(e);
    });
    return "ciao"
}

  render() {
    return (
      <div>
        <header className="dapp-header">
            <h3> Welcome to Meteor!</h3>
        </header>

     <div className="dapp-flex-content">
        <aside className="dapp-aside">

        </aside>

        <main className="dapp-content">

            
        </main>

        <aside className="dapp-actionbar">
           

        </aside>




    </div>
    <footer className="dapp-footer">

    </footer>
   </div>
    );
  }
}

App.propTypes = {
  contracts: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    contract: Contract.find({}).fetch(),
  };
}, App);