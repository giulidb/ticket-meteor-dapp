import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Train from '../Train.jsx'
import TrainTicket from '../TrainTicket.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NumericInput from 'react-numeric-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

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
        destination: "to: ",
        Tickets: [],
        trainTypes: [
                        {value: 'FR', label:'Le Frecce'},
                        {value: 'RV', label:'Regional'}
                    ],
        classes:[
                {value: '1', label: '1° Class'},
                {value: '2', label: '2° Class'}
        ],

        ticketType:[
                {value: 'single', label: "Simple Ticket"},
                {value: 'carnet', label: "10 Tickets Carnet"},
                {value: 'month', label: "Month Subscription"},
                {value: 'week', label: "Week Subscription"}
        ],

        selectedTrain: {value: 'RV', label:'Regional'},
        selectedClass:  {value: '2', label: '2° Class'},
        selectedTicket: {value: 'single', label: "Simple Ticket"},
        children: '0',
        adults: '1',
        hour: '0' ,
        seeTicket: 'false',
        buttonName: 'See Tickets',   
        loadingTickets: 'false',
        loadingResults: 'false'
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

  hourChange(){
         this.setState({hour: this.refs.hour.state.value});
  }

  childrenChange(){
         this.setState({children: this.refs.children.state.value});
  }

  adultsChange(){
         this.setState({adults: this.refs.adults.state.value});
  }

  handleData(){
      console.log(this.state.originId);
      console.log(this.state.destId);

      var d =  new Date(this.state.startDate);
      var date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + (d.getDate())).slice(-2) + 'T' + ("0" + (this.refs.hour.state.value + 1)).slice(-2)+':00:00'
      var link = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/' + this.state.originId.replace(/(?:\r\n|\r|\n)/g, '') + '/' + this.state.destId.replace(/(?:\r\n|\r|\n)/g, '') + '/' + date;
      return link;
}


   checkValue(){
       if(this.state.originId == undefined || this.state.destId == undefined ){
           return false;
       }
       return true;
   }


   search(){

     //check if user inserted valid stations name
     if(!this.checkValue()){
        Bert.alert('Please insert a valid origin and destination station','danger','growl-top-right','fa-frown-o');
        return;}
    
        var self = this;
        var link = this.handleData();
        console.log(link);
        this.setState({loadingResults: true});
        Meteor.call("RESTcall", link, (error, response)=>{
          console.log("callback");
                 var trains = [];
                 var res = JSON.parse(response.content)
                 console.log(res);
                 var solutions = res.soluzioni;
                 for(var i = 0; i < solutions.length; i++){
                    var search = true;
                    var vehicles = solutions[i].vehicles;
                        for(var j = 0; j < vehicles.length && search == true; j++){
                            if(j == 0)
                                solutions[i].orarioPartenza = vehicles[j].orarioPartenza;
                            if(j == vehicles.length - 1)
                                solutions[i].orarioArrivo = vehicles[j].orarioArrivo;    
                           // check if solutions match search paramters 
                           if(vehicles[j].categoriaDescrizione == 'REG' || vehicles[j].categoriaDescrizione == 'RV' ){
                               if(self.state.selectedTrain.value != 'RV'){
                                    search = false;}     
                           }
                           else{
                               if(self.state.selectedTrain.value == 'RV'){
                                   search = false;
                               }

                           }
                        }
                          // add valid solutions to results
                          
                          solutions[i].origine = res.origine;
                          solutions[i].destinazione = res.destinazione;          
                          
                          if(search == true)
                              trains.push(solutions[i]); 
                          if(self.state.selectedTicket.value != "single")
                                break;     
                        
            }

            console.log(trains);
            self.setState({results: trains});
            this.setState({loadingResults: false});
            if(this.state.results.length == 0)
                    Bert.alert('No solution matches your request!','warning','fixed-top','fa-frown-o');
            console.log("fine callback");       
      });
   
  }


    renderResults(){

    if(this.state.loadingResults == true)
        return(<div className = "loader"></div>);

    if(!(this.state.results.length > 0)){
        return;}    

    return(

                <div className>  
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
                  
                          return <Train key={trainIndex} train = {train} index = {trainIndex} ticketType = {this.state.selectedTicket.label} trainType = {this.state.selectedTrain.label} service = {this.state.selectedClass.label} numAdults =  {this.state.adults} children = {this.state.children}
                                />
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

    seeTickets(){
        console.log("seeTickets");
        this.setState({seeTicket: !this.state.seeTicket});
        this.setState({buttonName: (this.state.seeTicket ? "Hide Tickets" : "See Tickets")});
        this.setState({loadingTickets: "true"});
        this.loadTickets();
    }

    async loadTickets(){

        var addr = this.getContractAddr();
        if(addr.length > 0)  
               Session.set("contract_address",addr[0].address); 
        else
            return;       
        this.Transport = await selectContractInstance(transport_artifacts,Session.get("contract_address"));
        var numTicket = await this.Transport.numTickets.call(this.state.account);
        numTicket = numTicket.valueOf();
        if(numTicket > 0){
        var TicketItemsResp = [];
        var descriptions=[];
        var requestedTime=[];
        var emissionTimes= [];
        var status=[];
        for( var i = 0; i < numTicket; i++){
            
            const TicketItemResp = await this.Transport.getTicket.call(this.state.account,i);
            descriptions.push(TicketItemResp[0]);
            requestedTime.push(TicketItemResp[1]);
            emissionTimes.push(TicketItemResp[2]);
            status.push(TicketItemResp[3])
        }
        
    //    console.log(TicketItemsResp);
        TicketItemsResp.push(descriptions,requestedTime,emissionTimes,status);
        const TicketItems = mapReponseToJSON(TicketItemsResp,['description','requestedTime','emissionTime','status'],"arrayOfObject");
        this.setState({Tickets: TicketItems});}
        this.setState({loadingTickets: "false"});
 }
  
  logChangeTrain(val){
      console.log(val);
      this.setState({selectedTrain: val});
  }

  logChangeClass(val){
      console.log(val);
      this.setState({selectedClass: val});
  }

  logChangeTicket(val){
      console.log(val);
      this.setState({selectedTicket: val});
  }

  renderMyTickets(){
         
        if(this.state.seeTicket)
            return;

        if(this.state.loadingTickets == "true"){
            return(<div className= "loader" ></div>);
        }    

         if(this.state.Tickets.length == 0){
             return (
                    <div>
                        <p>You haven't tickets yet.</p>
                        
                    </div>); 
         }
        
            return(
                    <div>
                      <ul className="dapp-account-list">
                         <li>
                           <div className="row clear">
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
                                    <h3>Train Type</h3> 
                                    </span>
                                </div>  
                                <div className="col col-2 tablet-col-11 mobile-col-1-2">
                                    <span className="no-tablet no-mobile">
                                    <h3>Ticket Type</h3> 
                                    </span>
                                </div>
                                <div className="col col-2 tablet-col-11 mobile-col-1-2">
                                    <span className="no-tablet no-mobile">
                                    <h3>Status</h3> 
                                    </span>
                                </div>
                            </div>
                        </li>
                            {this.state.Tickets.map((item,itemIndex) => {
                                return <TrainTicket key={itemIndex} item = {item} index = {itemIndex}/>
                                })
                            }
                     </ul>
                </div> 
            );

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
                          <label>Date: </label><DatePicker dateFormat="YYYY-MM-DD" selected={this.state.startDate} minDate={moment().add(1,'days')} onChange = {this.handleDateChange.bind(this)}/>
                        </span>
                    </div>  
                    <div className="col col-1 tablet-col-11 mobtravelTimeile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Hour: </label><NumericInput ref="hour" className='form-control' min ={0} max = {23} value ={this.state.hour} onChange = {this.hourChange.bind(this)}/> 
                        </span>
                    </div>
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Adults: </label><NumericInput className='form-control' ref="adults" min ={1} max = {4} value ={this.state.adults} onChange = {this.adultsChange.bind(this)}/>
                        </span>
                    </div>    
                    <div className="col col-1 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Children: </label><NumericInput className='form-control' ref="children" min ={0} max = {4} value ={this.state.children} onChange = {this.childrenChange.bind(this)}/>
                        </span>
                    </div>  

            </div>
                 <br/><br/>
             <div className="row clear">
                    
                   <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Train type:</label><Select name="TrainType" value = {this.state.selectedTrain} options = {this.state.trainTypes} onChange = {this.logChangeTrain.bind(this)} /> 
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Service Level:</label><Select name="class" value = {this.state.selectedClass} options = {this.state.classes} onChange = {this.logChangeClass.bind(this)} /> 
                        </span>
                    </div> 
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Ticket Type:</label><Select name="ticketType" value = {this.state.selectedTicket} options = {this.state.ticketType} onChange = {this.logChangeTicket.bind(this)} /> 
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
                         <button onClick={this.seeTickets.bind(this)}>{this.state.buttonName}</button>
                        {this.renderMyTickets()}
                </div>     
                <br/><br/>
                <hr/>        
           
         </ReactCSSTransitionGroup>

    );
  }
}
