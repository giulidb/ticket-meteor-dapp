import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '../imports/ui/layouts/MainLayout.jsx';

import EventWrapper from '../imports/ui/EventWrapper.jsx';
import About from '../imports/ui/About.jsx'

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
        mount(MainLayout,{
            content: (<About/>)
        })
    }

}
);