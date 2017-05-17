import { Meteor } from 'meteor/meteor';
import { Events } from '../imports/api/events.js';
import '../imports/api/ethereum_accounts';
import '../imports/startup/server/loader.js';


Meteor.startup(() => {
    //code to run on server at startup
    /* console.log("Starting up server-side");
     var eventsCount = Events.find().count();
     console.log(eventsCount);
     // if we already have entries in the db, don't insert again.
     if (eventsCount > 0)
       return;
     
     var content = JSON.parse(Assets.getText('events.json'));
     console-log(content);

     // code to run on server at startup
     /*Assets.getText('events.json', function(err, data) {
       var content = JSON.parse(data);

       for(event in content){
         console.log('inserting', event);
         Events.insert(event);
       }
     })*/

});