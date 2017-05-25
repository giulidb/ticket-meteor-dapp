import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '../imports/ui/layouts/MainLayout.jsx';

import EventWrapper from '../imports/ui/pages/EventWrapper.jsx';
import TransportWrapper from '../imports/ui/pages/TransportWrapper.jsx';

import About from '../imports/ui/pages/About.jsx'
import EventDetailed from '../imports/ui/pages/EventDetailed.jsx'
import AccountsSettings from '../imports/ui/pages/AccountsSettings.jsx'
import '../imports/startup/accounts-config.js';


FlowRouter.route('/', {
    action(){
        mount(MainLayout,{
            content: (<EventWrapper/>)
        })
    }
});

FlowRouter.route('/transportServices', {
    action(){
        mount(MainLayout,{
            content: (<TransportWrapper/>)
        })
    }
});


FlowRouter.route('/about', {
    action(){
    if(!Meteor.userId()){
        Bert.alert("Pleas login to have access to this area", 'danger','fixed-top','fa-frown-o');
    }else{
        mount(MainLayout,{
        content: (<About/>)
        })}
    }
});

FlowRouter.route('/myAccounts', {
    action(){
    if(!Meteor.userId()){
        Bert.alert("Pleas login to have access to this area", 'danger','fixed-top','fa-frown-o');
    }else{
        mount(MainLayout,{
        content: (<AccountsSettings/>)
        })}
    }
});


FlowRouter.route('/events/:id', {
    action(params){
        mount(MainLayout,{
            content: (<EventDetailed id={params.id}/>)
        })
    }
});