import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Train from '../Train.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NumericInput from 'react-numeric-input';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ReactDOM from 'react-dom';


export default class TransportWrapper extends TrackerReact(Component) {

  constructor(){
    super();

    this.state = {
        results: [],
        startDate: moment()
    }

  }

  handleDateChange(date){
      this.setState({startDate:date});
  }

   search(){
      console.log("search");
      var self = this;
      var originId = 6009;
      var destId = 6500;
      var d =  new Date(this.state.startDate);
      var date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + (d.getDay() + 1)).slice(-2) + 'T' + this.refs.hour.state.value+':00:00'
      var link = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/' + originId + '/' + destId + '/' + date;
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

  render() {
     
    return (
         <div>
             <h1>Train tickets search</h1>
             <p>Insert search parameters</p>
             <form>
                 
                 <div className="row clear">
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Departure: </label><input type="text" name="from" value="from:" /> 
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Destination: </label><input type="text" name="to" value="to:" /> 
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
                    
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                           <label>Train type:</label><input type="text" name="train_type" value="All" /> 
                        </span>
                    </div>
                    <div className="col col-3 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                          <label>Service Level:</label><input type="text" name="train_type" value="All" />
                        </span>
                    </div> 
                    <div className="col col-4 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <h3></h3>
                        </span>
                    </div>
   
                 </div>

                  </form> 
                    <div className="col col-2 tablet-col-11 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                            <input type="submit" value="Search" onClick={this.search.bind(this)} />
                        </span>
                    </div> <br/>
                    <hr/>
                       {this.renderResults()}
   
         </div>

    );
  }
}
