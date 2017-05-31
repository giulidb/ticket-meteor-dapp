
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';


// Contract component - represents a single todo item
export default class Train extends Component {

    constructor(){
        super();
        this.state = {
            price: '',
            dP:'',
            dA:'',
            travelTime:''
        }
    }

    setTrain(){
        Session.set("trainTicket",this.props.train);
        FlowRouter.go('/trains/'+ this.props.index);
    }

    componentWillMount(){
         console.log("componentWillmount");
         this.setState({dP: new Date(Date.parse(this.props.train.orarioPartenza))});
         this.setState({dA: new Date(Date.parse(this.props.train.orarioArrivo))});
         this.setState({travelTime: new Date(Date.parse(this.props.train.orarioArrivo - this.props.train.orarioPartenza))});
         Meteor.call("REST.computePrice", this.props.train.orarioArrivo,this.props.train.orarioPartenza, this.props.service, this.props.trainType,
                     this.props.children, this.props.numAdults, this.props.ticketType, (error, response)=>{
            this.setState({price: response});
            console.log(response);
      });
    }


  render() {
      console.log("Train render");

    return(
        <li>
          
                <div className="row clear">
                <button  onClick={this.setTrain.bind(this)}> 
                       
                    <div className="col col-2 tablet-col-2 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                    <h3>{("0" + (this.state.dP.getHours() + 1)).slice(-2)} : {("0" + (this.state.dP.getMinutes() + 1)).slice(-2)}</h3>
                                    <span>{this.props.train.origine}</span>
                        </span>
                    </div>

                     <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <h3>{("0" + (this.state.dA.getHours() + 1)).slice(-2)} : {("0" + (this.state.dA.getMinutes() + 1)).slice(-2)}</h3>
                                <span>{this.props.train.destinazione}</span>
                        </span>
                    </div>

                    <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <span>{("0" + (this.state.travelTime.getHours() + 1)).slice(-2)} : {("0" + (this.state.travelTime.getMinutes() + 1)).slice(-2)}</span>

                        </span>
                    </div>

                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                             <span>{this.props.train.categoriaDescrizione}</span>
                                <h3>{this.props.train.numeroTreno}</h3>  
                        </span>
                    </div>

                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                <h3>{this.state.price}€</h3>
                                <span>{EthTools.formatBalance(EthTools.toWei(this.state.price,'eur'),'0.00','ether')} ETH</span>
                        </span>
                    </div> 
            </button>
           </div>
           <hr/>
        </li>            
    );

  }

}