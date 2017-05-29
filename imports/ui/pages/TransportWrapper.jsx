import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Train from '../Train.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NumericInput from 'react-numeric-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';

// Ethereum libraries and contracts
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import transport_artifacts from '../../api/ethereum/truffle/build/contracts/Transport.json'
import {transport} from '../../api/transport.js'

export default class TransportWrapper extends TrackerReact(Component) {

  constructor(){
    super();

    this.state = {
         subscription: {
                contract: Meteor.subscribe('contractAddress')
            },
        results: [],
        account: Session.get('account'),
        gasPrice: 100000000000,
        gas: 2500000,
        startDate: moment(),
        origin: "from:",
        destination: "to: "
    }

  }

   componentWillUnmount(){
        this.state.subscription.contract.stop();

  }
  
  handleDateChange(date){
      this.setState({startDate:date});
  }

  depChange(e){
         this.setState({origin: e.target.value});
         Meteor.call("REST.stationID", e.target.value, (error, response)=>{
            this.setState({originId: response});
      });
  }

  destChange(e){
         this.setState({destination: e.target.value});
         Meteor.call("REST.stationID", e.target.value, (error, response)=>{
            this.setState({destId: response});
      });
  }

  handleData(){
      var destId = 6500;
      console.log(this.state.originId);
      console.log(this.state.destId);

      var d =  new Date(this.state.startDate);
      var date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + (d.getDay() + 1)).slice(-2) + 'T' + ("0" + (this.refs.hour.state.value + 1)).slice(-2)+':00:00'
      var link = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/' + this.state.originId.replace(/(?:\r\n|\r|\n)/g, '') + '/' + destId + '/' + date;
      return link;
}

   search(){
     
      var self = this;
      var link = this.handleData();
      console.log(link);

      Meteor.call("RESTcall", link, (error, response)=>{
          console.log("callback");
                 var trains = [];
                 console.log(response);
                 var res = JSON.parse(response.content)
                 console.log(res);
                 var solutions = res.soluzioni;
                 console.log(solutions);
                 for(var i = 0; i < solutions.length; i++){
                    var vehicles = solutions[i].vehicles;
                        for(var j = 0; j < vehicles.length; j++){
                            trains.push(vehicles[j]);
                        }
            }

            console.log(trains);
            self.setState({results: trains});
            console.log("fine callback");
            
      });
   
  }


    renderResults(){

    if(!this.state.results.length > 0){
        return;}

        console.log("render result");
    return(

                <div>  
                    <h1>Results</h1>

                 <ul className="dapp-account-list">

                 <li><div className="row clear">
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <h3>Departure</h3> 
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <h3>Arrival</h3>
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <h3>Duration</h3> 
                        </span>
                    </div>  
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <h3>Train</h3> 
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <h3>Price</h3> 
                        </span>
                    </div>
                 </div>
                 </li>
                       {this.state.results.map((train,trainIndex) => {
                          return <Train key={trainIndex} train = {train} index = {trainIndex}/>
                      })
                    }
                   <hr/> 
                   </ul> 
                </div> 

                

            );        
       

  }

    /* function for Ethereum */
    getContractAddr(){
        return transport.find({}).fetch();
  }

    async loadTickets(){
        console.log("load Tickets");
        this.Transport = await selectContractInstance(transport_artifacts,Session.get("contract_address"));
        const TicketItemsResp = await this.Transport.getTickets.call(this.state.account);
        console.log(TicketItemsResp);
        const TicketItems = mapReponseToJSON(TicketItemsResp,['description','requestedTimes','emissionTimes','emitted','valid'],"arrayOfObject");
        console.log(TicketItems);
 }
  

  render() {

     var addr = this.getContractAddr();
        if(addr.length > 0){  
              
               Session.set("contract_address",addr[0].address);
               this.loadTickets();
       }  
     
    return (
         <div>

             <h1>Train tickets search</h1>
             <p>Insert search parameters</p>
             
              <div className="row clear">
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Departure: </label><input type="text" name="from" value={this.state.origin} onChange={this.depChange.bind(this)} /> 
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Destination: </label><input type="text" name="to" value={this.state.destination} onChange={this.destChange.bind(this)}/> 
                        </span>
                    </div>
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Date: </label><DatePicker dateFormat="YYYY-MM-DD" selected={this.state.startDate} onChange = {this.handleDateChange.bind(this)}/>
                        </span>
                    </div>  
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Hour: </label><NumericInput ref="hour" className='form-control' min ={0} max = {23} value ={0}/> 
                        </span>
                    </div>
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Adults: </label><NumericInput className='form-control' min ={0} max = {4} value ={1}/>
                        </span>
                    </div>    
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Children: </label><NumericInput className='form-control' min ={0} max = {4} value ={0}/>
                        </span>
                    </div>  

            </div>
                 <br/>
             <div className="row clear">
                    
                   {/*} <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Train type:</label><input type="text" name="train_type" value="All" /> 
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Service Level:</label><input type="text" name="train_type" value="All" />
                        </span>
                    </div> 
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Ticket Type:</label><input type="text" name="train_type" value="All" />
                        </span>
                    </div>*/}

                    <div className="col col-9 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <h3></h3>
                        </span>
                    </div>
                 
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <label>{" "}</label><input type="submit" value="Search" onClick={this.search.bind(this)} />
                        </span>
                    </div>
                </div>
                     <br/><br/>
                    <hr/>
                       {this.renderResults()}
                    
                    
                    
                    <br/>

                 <div>
                    <h1>My Tickets</h1>
                    <button>See my tickets</button>
                </div>

                <br/><br/>
                <hr/>             
           
         </div>

    );
  }
}
