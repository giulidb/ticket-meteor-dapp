import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class About extends Component{


    render(){

        return(
                <ReactCSSTransitionGroup
                component = "div"
                transitionName="route"
                transitionEnterTimeout={600}
                transitionAppearTimeout={600}
                transitionLeaveTimeout={400}
                transitionAppear={true}>
                    <h3>About us </h3>
                    <p>Hi! We are Nathan Strandberg and Katie Kirk, two individuals with a passion for creativity — creativity makes us happy. We truly believe in the transformative power of illustration and design and their ability to simplify communications, elevate experiences, engage and inspire people everywhere. Good design and good relationships come from collaboration. We're excited to start a visual dialogue, learn about you, and make something beautiful together.</p>
                    
                </ReactCSSTransitionGroup>
                
        )
    }

}