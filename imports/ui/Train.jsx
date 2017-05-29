
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class Train extends Component {

    setTrain(){
        Session.set("train",this.props.train);
        FlowRouter.go('/trains/'+ this.props.index);
    }

  render() {
             var dP = new Date(Date.parse(this.props.train.orarioPartenza));
             var dA = new Date(Date.parse(this.props.train.orarioArrivo));
             var travelTime = new Date(Date.parse(this.props.train.orarioArrivo) - Date.parse(this.props.train.orarioPartenza));
            
    return(
        <li>
          
                <div className="row clear">
                <button  onClick={this.setTrain.bind(this)}> 
                       
                    <div className="col col-2 tablet-col-2 mobile-col-1-2">
                        <span className="no-tablet no-mobile">
                                    <h3>{("0" + (dP.getHours() + 1)).slice(-2)} : {("0" + (dP.getMinutes() + 1)).slice(-2)}</h3>
                                    <span>{this.props.train.origine}</span>
                        </span>
                    </div>

                     <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <h3>{("0" + (dA.getHours() + 1)).slice(-2)} : {("0" + (dA.getMinutes() + 1)).slice(-2)}</h3>
                                <span>{this.props.train.destinazione}</span>
                        </span>
                    </div>

                    <div className="col col-2 tablet-col-2 mobile-full">
                        <span className="no-tablet no-mobile">
                                <span>{("0" + (travelTime.getHours() + 1)).slice(-2)} : {("0" + (travelTime.getMinutes() + 1)).slice(-2)}</span>

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
                                <h3>5.50€</h3>
                                <span>0.05 ETH</span>
                        </span>
                    </div> 
            </button>
           </div>
           <hr/>
        </li>            
    );

  }

}