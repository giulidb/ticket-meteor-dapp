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
    'REST.computePrice': function(orarioArrivo, orarioPartenza, service, train, adults, children, type) {
        console.log("orario 1: " + orarioArrivo);
        console.log("orario 2: " + orarioPartenza);
        var duration = new Date(Date.parse(orarioArrivo - orarioPartenza));
        var price = 0.12 * (duration.getHours() * 60 + duration.getMinutes());
        console.log("intial price: " + price);
        if (train != "REG")
            price *= 2;
        switch (type) {
            case "10 Tickets Carnet":
                price *= 6.50;
                break;
            case "Month Subscription":
                price *= 7.27;
                break;
            case "Week Subscription":
                price *= 4.50;
                break;

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