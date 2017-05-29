import { Meteor } from 'meteor/meteor';

//methods
Meteor.methods({

    'REST.stationID': function(station) {
        var originResp = Meteor.http.call("GET", "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/" + station);
        console.log(originResp);
        return originResp.content.split('|S')[1].replace(/\b0+/g, '');

    },

    'RESTcall': function(link) {
        this.unblock();
        console.log(link);
        return Meteor.http.call("GET", link);
    }
});