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
                    <h1>About</h1>
                    <p>This is ...</p>
                    
                </ReactCSSTransitionGroup>
                
        )
    }

}