import { Meteor } from 'meteor/meteor';

//methods
Meteor.methods({

    'REST.stationID': function(station) {
        var originResp = Meteor.http.call("GET", "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/" + station);
        return originResp.content.split('|S')[1].replace(/\b0+/g, '');

    },

    'RESTcall': function(link) {
        this.unblock();
        return Meteor.http.call("GET", link);
    },


    /* Fictitious price function because Trenitalia does not have public API for prices */
    'REST.computePrice': function(duration, service, train, adults, children, type) {
        var hours = parseInt(duration.split(':')[0]);
        var minutes = parseInt(duration.split(':')[1]);
        console.log(hours*60);
        console.log(minutes);
        var price = 0.10*(hours * 60 + minutes);
        console.log("intial price: " + price);
        if (train != "REG" && train != "RV")
            price *= 4;
        switch (type) {
            case "10 Tickets Carnet":
                price *= 6.50;
                break;
            case "Month Subscription":
                price *= 7.20;
                break;
            case "Week Subscription":
                price *= 4.50;
                break;
            default:
                price = price; 

        }

        var partialPrice = 0;
        if (children > 0) {
            partialPrice = price * 0.80;
            partialPrice *= children;
        }

        price *= adults;
        if (service == "1° Class")
            price *= 1.50;
        console.log("final price: " + price);
        return (price + partialPrice).toFixed(2);

    }

});