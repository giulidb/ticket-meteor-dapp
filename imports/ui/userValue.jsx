
import React, {Component} from 'react';
import PropTypes from 'prop-types';


// Contract component - represents a single todo item
export default class userValue extends Component {

    constructor(props){
    super(props);

    
    console.log("const");
  } 

  componentDidMount(){  
    console.log("mount");
  }

  render() {
    return (
   
            <div><p>prova</p></div>
    

    );

  }

}