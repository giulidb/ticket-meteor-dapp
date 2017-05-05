import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class About extends Component{


    render(){

        return(
                <ReactCSSTransitionGroup
                  component="div"
                  transitionName="route"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={300}
                  transitionAppear={true}
                  transitionAppearTimeout={500}>
                    <h1>My tickets </h1>
                    <p>You didn't buy any tickets yet.</p>
                    
                </ReactCSSTransitionGroup>
                
        )
    }

}