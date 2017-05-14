var Event = artifacts.require("./Event.sol");

contract('Event', function(accounts) {
	console.log(accounts);
	var owner_account = accounts[0];
  var user_account = accounts[1];


  it("Constructor Test", function(done) {
  	
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

	var price;
	  it("Buy Ticket Test", function(done) {
		
		Event.deployed().then(function(instance){
		event = instance;
		return event.addTickets("Posto Unico in Piedi",5,100,{from: owner_account}).then(function(){
			console.log("Tickets added");
			event.compute_price(0,1,{from: user_account}).then(function(value){
				price = value;
				console.log("Ticket Price: "+ price.valueOf());
			}).then(function(){
				event.buyTicket(0,1,{from: user_account,value: 5}).then(
					function(res){
						console.log(res);
						done();
					}
				);
			}

			);
			
		}).catch(function(e){
			console.log(e);
		})
		}).catch(function(e){
			console.log(e);
		});

	});

	  it("Try to use Ticket Test", function(done) {
		
		Event.deployed().then(function(instance){
		event = instance;
		return event.addTickets("Posto Unico in Piedi",5,100,{from: owner_account}).then(function(){
			console.log("Tickets added");
			event.compute_price(0,1,{from: user_account}).then(function(value){
				price = value;
				console.log("Ticket Price: "+ price.valueOf());
			}).then(function(){
				event.buyTicket(0,1,{from: user_account,value: 5}).then(
					function(res){
						console.log(res);
						event.getTicket.call(user_account,0).then(function(value){
							console.log(value.valueOf());
						event.useTicket.call(0, {from: user_account}).then(function(value){
							console.log(value);
							assert.equal(value, true, "use goes wrong");
							event.useTicket.call(0, {from: user_account}).then(function(value){
								console.log(value);
								assert.equal(value, false, "use goes wrong");
								done();});
							});

						});
					});
			});
		}).catch(function(e){
				console.log(e);
			});
	}).catch(function(e){
				console.log(e);
			});
	  });

});
