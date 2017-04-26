import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '../imports/ui/layouts/MainLayout.jsx';

import EventWrapper from '../imports/ui/EventWrapper.jsx';
import About from '../imports/ui/About.jsx'
import EventDetailed from '../imports/ui/EventDetailed.jsx'

FlowRouter.route('/', {
    action(){
        mount(MainLayout,{
            content: (<EventWrapper/>)
        })
    }

}
);

FlowRouter.route('/about', {
   
    action(){

         if(!Meteor.userId()){
        Bert.alert("Pleas login to have access to this area", 'danger','fixed-top','fa-frown-o');
    }

    else{
        mount(MainLayout,{
            content: (<About/>)
        })
    }
    }
}
);

FlowRouter.route('/events/:id', {
    action(params){
        mount(MainLayout,{
            content: (<EventDetailed id={params.id}/>)
        })
    }

}
);