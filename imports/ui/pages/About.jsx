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
                    <h1>About us </h1>
                    <p>Hi! We are Nathan Strandberg and Katie Kirk, two individuals with a passion for creativity — creativity makes us happy. We truly believe in the transformative power of illustration and design and their ability to simplify communications, elevate experiences, engage and inspire people everywhere. Good design and good relationships come from collaboration. We're excited to start a visual dialogue, learn about you, and make something beautiful together.</p>
                    
                </ReactCSSTransitionGroup>
                
        )
    }

}