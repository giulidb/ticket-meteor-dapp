
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import Vehicle from './Vehicle.jsx';


// Contract component - represents a single todo item
export default class Train extends Component {

    constructor(){
        super();
        this.state = {
            price: '',
            dP:'',
            dA:'',
            travelTime:'',
            hA:'',
            hP:''
        }
    }

    setTrain(){
        this.props.train.price = EthTools.toWei(this.state.price,'eur');
        this.props.train.class = this.props.service;
        this.props.train.ticketType = this.props.ticketType;
        this.props.train.adults = this.props.numAdults;
        this.props.train.children = this.props.children;
        this.props.train.expirationDate = this.computeExipirationDate();
        this.props.train.trainType = this.props.trainType;
        console.log(this.props.train);
        Session.set("trainTicket",this.props.train);
        Session.set("ReqPage","Server");
        FlowRouter.go('/trains/'+ this.props.index);
    }

    componentWillMount(){
         var dP = new Date(Date.parse(this.props.train.orarioPartenza));
         var dA = new Date(Date.parse(this.props.train.orarioArrivo));
         this.setState({dP:dP});
         this.setState({dA:dA});         
         console.log("TicketType: "+ this.props.ticketType);
         if(this.props.ticketType == 'Simple Ticket'){
                this.setState({hP: ("0" + (dP.getHours() + 1)).slice(-2) +':' +("0" + (dP.getMinutes() + 1)).slice(-2)});
                this.setState({hA: ("0" + (dA.getHours() + 1)).slice(-2) +':' +("0" + (dA.getMinutes() + 1)).slice(-2)});
            }
            console.log(this.state.hP);
         Meteor.call("REST.computePrice", this.props.train.durata, this.props.service, this.props.trainType,
                     this.props.children, this.props.numAdults, this.props.ticketType, (error, response)=>{
            this.setState({price: response});
      });
    }


        

    renderVehicles(){

       if(this.props.ticketType == 'Simple Ticket'){ 
       return(<div>
           {this.props.train.vehicles.map((vehicle,vehicleIndex) => {
                          return (<Vehicle key={vehicleIndex} vehicle = {vehicle}/>)     
                        })
            }
            </div>
    );
       }
       else{
           return(<span>{this.props.trainType}</span>);
       }
        
    }
    
    computeExipirationDate(){
        var expirationDate;
        switch(this.props.train.ticketType){
            case "Simple Ticket":            
                expirationDate = new Date(this.state.dP.getFullYear(),this.state.dP.getMonth(),this.state.dP.getDate());
                expirationDate.setDate(this.state.dP.getDate() + 1);
                break;
        case "Month Subscription": 
                expirationDate = new Date(this.state.dP.getFullYear(),this.state.dP.getMonth()+1,1);
                expirationDate.setDate(expirationDate.getDate() - 1);
                break;
        case "Week Subscription":
                expirationDate = new Date(this.state.dP.getFullYear(),this.state.dP.getMonth(),this.state.dP.getDate());
                expirationDate.setDate(this.state.dP.getDate() + 7);
                break;
        case "10 Tickets Carnet":
                expirationDate = new Date(this.state.dP.getFullYear(),this.state.dP.getMonth(),this.state.dP.getDate());
                expirationDate.setDate(this.state.dP.getDate() + 180);
                break;      
        
        }
        console.log(Date.parse(expirationDate));
        return Date.parse(expirationDate)/1000;
    }


  render() {

    return(
        <div>
            <hr/>
                <li>
                    <div className="row clear">
                       
                    <div className="col col-2 tablet-col-2 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                    <h3>{this.props.train.origine}</h3>
                                    <span>{this.state.hP}</span>
                        </span>
                    </div>

                     <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <h3>{this.props.train.destinazione}</h3>
                                <span>{this.state.hA}</span>
                        </span>
                    </div>

                    <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <span>{this.props.train.durata}</span>
                                <h3>Changes: {this.props.train.vehicles.length - 1}</h3>
                        </span>
                    </div>

                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                         <span className="no-tablet no-mobile">
                             {this.renderVehicles()}
                         </span>
                    </div>

                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                <h3>{this.state.price}€</h3>
                                <span>{EthTools.formatBalance(EthTools.toWei(this.state.price,'eur'),'0.00','ether')} ETH</span>
                        </span>
                    </div> 
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                             <h3><button  onClick={this.setTrain.bind(this)}>Buy</button></h3>

                        </span>
                    </div> 
           </div>
         </li>
        </div>            
    );

  }

}