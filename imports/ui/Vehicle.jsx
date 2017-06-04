
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Vehicle extends Component {


  render() {
    console.log(this.props);
    return(
        <div>
            <span>{this.props.vehicle.categoriaDescrizione}</span>
             <h3>{this.props.vehicle.numeroTreno}</h3>       
        </div>            
    );

  }

}