import { Meteor } from 'meteor/meteor';
var urljoin = require('url-join'); 

function joinUrl(o,d){
    return urljoin('http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew',o,dS,'2017-05-31T00:00:00');
}
//methods
Meteor.methods({

    'RESTcall':function (link) {
            this.unblock();
            // retrive station id from Station name
            /*var originResp = Meteor.http.call("GET", "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/Massa Centro");
            console.log(originResp);
            var destResp = Meteor.http.call("GET", "http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/Pisa Centrale");
           var originId = originResp.content.split('|S')[1].replace(/\b0+/g, '');
           var destId = destResp.content.split('|S')[1].replace(/\b0+/g, '');
           console.log(originId);
           console.log(destId);
           var fullUrl = this.joinUrl(originId,destId);*/
           console.log(link);         
           return Meteor.http.call("GET", link);
    }
});    