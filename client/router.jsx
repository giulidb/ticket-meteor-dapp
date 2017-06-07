import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '../imports/ui/layouts/MainLayout.jsx';

import EventWrapper from '../imports/ui/pages/EventWrapper.jsx';
import TransportWrapper from '../imports/ui/pages/TransportWrapper.jsx';

import Admin from '../imports/ui/pages/Admin.jsx'
import EventDetailed from '../imports/ui/pages/EventDetailed.jsx'
import TrainDetailed from '../imports/ui/pages/TrainDetailed.jsx'

import AccountsSettings from '../imports/ui/pages/AccountsSettings.jsx'
import {Meteor} from 'meteor/meteor'
import '../imports/startup/accounts-config.js'


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


FlowRouter.route('/admin', {
    action(){
    if(!Meteor.userId()){
        Bert.alert("Pleas login to have access to this area", 'danger','growl-top-right','fa-frown-o');
    }else{
        mount(MainLayout,{
        content: (<Admin/>)
        })}
    }
});

FlowRouter.route('/myAccounts', {
    action(){
    if(!Meteor.userId()){
        Bert.alert("Pleas login to have access to this area", 'danger','growl-top-right','fa-frown-o');
    }else{
        mount(MainLayout,{
        content: (<AccountsSettings/>)
        })}
    }
});


FlowRouter.route('/events/:id', {
    action(params){
        if(!Meteor.userId()){
            Bert.alert("Pleas login to have access to this area", 'danger','growl-top-right','fa-frown-o');
        }else{
            mount(MainLayout,{
                content: (<EventDetailed id={params.id}/>)
            })}
    }
});

FlowRouter.route('/trains/:id', {
    action(params){
          if(!Meteor.userId()){
                Bert.alert("Pleas login to have access to this area", 'danger','growl-top-right','fa-frown-o');
            }else{
                mount(MainLayout,{
                    content: (<TrainDetailed id={params.id}/>)
                })}
    }
});