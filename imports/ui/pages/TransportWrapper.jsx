import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// Import libraries
import Web3 from '../../api/ethereum/web3.js';


// Import contract artifacts and turn them into usable abstractions.
//import Conference_artifacts from '../api/ethereum/truffle/build/contracts/Conference.json'
//import { default as contract } from 'truffle-contract'

// App component - represents the whole app
export default class TransportWrapper extends Component {

  constructor(){
    super();

    this.state = {
      subscription: {
        events: Meteor.subscribe('allEvents')
      }
    }

    

  }

  componentWillUnmount(){
    this.state.subscription.events.stop();

  }


  render() {
     
    if(!this.state.subscription.events.ready)
        <div>Loading...</div>
    return (
          <ReactCSSTransitionGroup
             component="div"
             transitionName="route"
             transitionEnterTimeout={500}
             transitionLeaveTimeout={300}
             transitionAppear={true}
             transitionAppearTimeout={500}>
             <h1>Train ticket search</h1>
             <form>
                 
                 <div className="row clear">
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="from" value="from:" /> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="to" value="to:" /> 
                        </span>
                    </div>    
                 </div>
                 <br/>
                  <div className="row clear">
                    <div className="col col-8 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="type" value="Ticket type:" /> 
                        </span>
                    </div>  
                 </div>
                 <br/>
                 <div className="row clear">
                     <hr/>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="train_type" value="Train type:" /> 
                        </span>
                    </div>
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="service_level" value="Service Level:" /> 
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
                            <input ref="total" className='form-control' value = {0} disabled={true}/>
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
                            <input type="submit" value="Search" />
                        </span>
                    </div>      
                 </div> 
         </ReactCSSTransitionGroup>

    );
  }
}
