var Event = artifacts.require("./Event.sol");

contract('Event', function(accounts) {
	console.log(accounts);
	var owner_account = accounts[0];
  var user_account = accounts[1];


  it("Initial conference settings should match", function(done) {
  	
  	Event.deployed().then(
  		function(event) {
  			event.owner.call().then(
  				function(owner) { 
						console.log("Owner account: "+ owner);
  					assert.equal(owner, owner_account, "Owner doesn't match!"); 
  			}).then(
  				function() { 
  					return event.eventTime.call(); 
  			}).then(
  				function(eventTime) { 
						console.log("Timestamp: " + eventTime ); 
  					assert.equal(eventTime, 1498338000, "Time doesn't match!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Initial conference settings should match", function(done) {
		
		Event.deployed().then(function(instance){
		event = instance;
		return event.addTickets("Posto Unico in Piedi",5,100,{from: owner_account}).then(function(){
			console.log("Tickets added");
			assert.equal("ciao", "ciao", "Time doesn't match!");
			done();
		}).catch(function(e){
			console.log(e);
		})
		}).catch(function(e){
			console.log(e);
		});

	});

});


