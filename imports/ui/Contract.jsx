import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Contract extends TrackerReact(Component) {

 constructor(){
    super();

    this.state = {
        userAddress: 'User Address: ',
        userId: 'User Id'

    }
 }

verifyIdentity(){}

withdraw(){}

userAddressChange(e){
         this.setState({userAddress: e.target.value});
}

userIdChange(e){
         this.setState({userAddress: e.target.value});
}

   render() {


        return (
                
            <li><hr/><div className="row clear">
                <div className="col col-4 tablet-col-11 mobile-col-1-2">
                    <span className="no-tablet no-mobile">
                                    <h3>Contract Name: {}</h3>
                                    <span>Contract Address: {} </span><br/>
                    </span>
                </div>
                <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                        <span className="no-tablet no-mobile">
                          <input type="text" name="from" value={this.state.userAddress} onChange={this.userAddressChange.bind(this)} /> 
                        </span>
                        <span className="no-tablet no-mobile">
                          <input type="text" name="from" value={this.state.userId} onChange={this.userIdChange.bind(this)} /> 
                        </span>
                            <button onClick={this.verifyIdentity.bind(this)}>
                                <h3>Verify Identity</h3>
                            </button>
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                       
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <h1></h1>
                </div>
                
               <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                            <button onClick={this.withdraw.bind(this)}>
                                <h3>Withdraw Revenue</h3>
                                <span>Contract Balance: {} ETH / {/*EthTools.formatBalance(, '0.00', 'eur')*/}€ </span>
                            </button>
                    </span>
                </div>

             </div>
        </li>
    );

  }
} 