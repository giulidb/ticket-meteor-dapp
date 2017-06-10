pragma solidity ^0.4.0;


/** @title Contract for tickets sells concerning Transport Service  .*/
/** @author Giulia Di Bella .*/

contract Transport{ 

    // Transport Service's name
    string public ServiceName;
    // contract's owner
    address public owner;
    // Users' balances 
    mapping(address => uint) public balances;
    // TicketsOf
    mapping (address => Ticket[]) public TicketsOf;
    // Users' Identities
    mapping (address => uint256) public Identities;
    //Type of Tickets
    enum TicketTypes{single,carnet,subscription}
    // Deposit quota
    uint public depositQuota ;
    
    // Struct representing a single Ticket 
    // initialized partially by the user in makeDeposit()
    // and completed consistently in configureTicket() by the owner
    struct Ticket{
            string description;
            TicketTypes t;
            uint requestedTime;
            uint emissionTime;
            uint expirationTime; 
            uint maxUses; //unused for temporal subscription tickets.        
            uint numUsed;
            uint price;
            bytes32 ticketHash;
            bytes32 status;
    }
    

    // Use of an event to pass along return values from contracts, 
	// to an app's frontend
    event DepositDone(address _from, uint _amount, bytes32 ticketHash, uint _timestamp);
    event TicketConfigured(address _to, uint _id, bytes32 ticketHash, uint _timestamp);
	event TicketPayed(address _from, uint _amount, uint _id, uint _timestamp);
	event DepositRefunded(address _to, uint _amount, uint _timestamp);
	event TicketUsed(address _to, uint _index, uint _timestamp);
	event RevenueCollected(address _owner, uint _amount, uint _timestamp);
    event UserRefunded(address _to, uint _amount);
	

	// This means that if the owner calls this function, the
	// function is executed and otherwise, an exception is
	// thrown.
	modifier onlyOwner {
		if (msg.sender != owner)
			throw;
		_;
	}
    

    // This modifier requires a certain
    // price being associated with a function call.
    // If the caller sent too much, he or she is
    // refunded, but only after the function body.
    // This was dangerous before Solidity version 0.4.0,
    // where it was possible to skip the part after `_;`.
    modifier costs(uint _amount, address addr) {
        if (msg.value < _amount)
            throw;
        _;
        if (msg.value > _amount)
           if(addr.send(msg.value - _amount))
               UserRefunded(addr,msg.value - _amount);
    }


    //This means that the function will be executed
    //only if balances[msg.sender] > 0
    modifier onlyValue() { if(balances[msg.sender]  > 0 ) _; else throw; }
    

    // Block timestamp dependance is a security issue: miners set 
    // the timestamp for the block. Normally, the timestamp is 
    // set as the current time of the miner’s local system. 
    // However he can vary this value by roughly 900 seconds,
    // while still having other miners accept the block.
    // Alternatively can be used block numbers.
    modifier onlyBefore(uint Timestamp){ if(now <= Timestamp + 30 minutes) _; else throw;}
    modifier onlyAfter(uint Timestamp){ if(now > Timestamp + 30 minutes) _; else throw;}
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport(string _name,
	                   uint _depositQuota) {
		owner = msg.sender;	
		ServiceName = _name;
        depositQuota = _depositQuota;
	}
	
	
    /// Step1 - User makes a deposit and requests a Ticket	
   function makeDeposit(string _description,
                        uint256 _idHash,
                        uint _price,
                        uint _expirationTime,
                        uint _maxUses)
                        costs(depositQuota,msg.sender)
                        public payable{

        // check if exists already a non-solved request
        if(balances[msg.sender] > 0)
            throw;
        //set User Identity
        Identities[msg.sender] = _idHash;    
        // Insert a new Ticket request
        uint index = TicketsOf[msg.sender].length++;
        Ticket ticket = TicketsOf[msg.sender][index];
        ticket.requestedTime = now;
        ticket.description = _description;
        ticket.status = "requested";
        ticket.ticketHash = sha3(_price,_expirationTime,_maxUses);
        balances[msg.sender] += depositQuota;
        //log this event
        DepositDone(msg.sender, depositQuota, ticket.ticketHash, now);
        }

    
	/// Step2 - After Step1 Owner can configure the ticket for a certain user
    /// if the info are consistent otherwise he doesn't release the ticket.
    function configureTicket(address addr,
                             uint _t,
                             uint index,
                             uint _expirationTime, 
                             uint _maxUses,
                             uint _price
                             ) onlyOwner
                            onlyBefore(TicketsOf[addr][index].requestedTime)
                            public{

        Ticket ticket = TicketsOf[addr][index]; 
        // Check if the ticket is consistent
        if(ticket.ticketHash != sha3(_price,_expirationTime,_maxUses))
            throw;
        
        // Configure the ticket
        ticket.t = TicketTypes(_t);
        ticket.emissionTime = now;
        ticket.expirationTime = _expirationTime;
        ticket.maxUses = _maxUses;
        ticket.numUsed = 0;
        ticket.price = _price;
        ticket.status = "emitted";
        // log this event
        TicketConfigured(addr, index, ticket.ticketHash, now);
        
    }


  // Step3 - User can buy a ticket
    function buyTicket(uint index)
                       costs(TicketsOf[msg.sender][index].price,msg.sender)
                       onlyBefore(TicketsOf[msg.sender][index].emissionTime)
                       public payable{
            
            Ticket ticket = TicketsOf[msg.sender][index];                                   
            if(ticket.status != "emitted")
                throw;
            balances[owner] += TicketsOf[msg.sender][index].price + depositQuota;
            balances[msg.sender] = 0;
            TicketsOf[msg.sender][index].status = "valid";
            // log this event
            TicketPayed(msg.sender, TicketsOf[msg.sender][index].price, index, now);     
}
    
    /// Step4 - After step 3 User can use the ticket any time it's allowed.
	function useTicket(uint index) onlyBefore(TicketsOf[msg.sender][index].expirationTime)
	                               public{

        Ticket ticket = TicketsOf[msg.sender][index];                                   
	     //check if user has completed the purchased
        if(ticket.status != "valid")
            throw;
	    // Check if the ticket is usable.   
	   if((ticket.t != TicketTypes.subscription && ticket.numUsed >= ticket.maxUses))
                throw;
        
        ticket.numUsed++;  
	    //log this event
    	TicketUsed(msg.sender, index, now);
	 }


    /// Step2.1 After step1 User can withdraw his deposit back if DT does not emitt the ticket in time.
    function withdrawDeposit(uint index) onlyValue
                                    onlyAfter(TicketsOf[msg.sender][index].requestedTime)
                                    returns(bool){
                
                // check if the tickets has been emitted
                if(TicketsOf[msg.sender][index].status == "emitted")
                        throw;
                
                uint amount = balances[msg.sender];
                // Remember to zero the pending refund before
                // sending to avoid re-entrancy attacks
                balances[msg.sender] = 0;

                if (msg.sender.send(amount)) {
                    // Delete Ticket from the contract
                    if(TicketsOf[msg.sender].length > 1)
                        for(uint i = index; i < TicketsOf[msg.sender].length - 1 ; i++)
                                TicketsOf[msg.sender][i] = TicketsOf[msg.sender][i+1];
                    TicketsOf[msg.sender].length--;              
                    DepositRefunded(msg.sender, amount,now);
                    return true;

                } else {
                    balances[msg.sender] = amount;
                    return false;
                }
        
    }
    

    /// Step3.2 After step2 Owner can withdraw Users's deposit if user does not buy the emitted ticket in time.
    function collectDeposit(uint index, address addr) 
                              onlyOwner 
                              onlyAfter(TicketsOf[addr][index].emissionTime)
                              returns (bool)
        {   //check if user has completed the purchased
            if(TicketsOf[addr][index].status == "valid")
                throw;
       
                uint amount = balances[addr];
                // Remember to zero the pending refund before
                // sending to avoid re-entrancy attacks
                balances[addr] = 0;
                if (msg.sender.send(amount)) {
                    RevenueCollected(msg.sender, amount,now);
                    return true;
                } else {
                    balances[addr] = amount;
                    return false;
                 }
            
      }
 
  	
    /// Withdraw pattern fot the organizer
	function withdraw() onlyValue public returns(bool){
	    
        uint amount = balances[msg.sender];
        // Remember to zero the pending refund before
        // sending to avoid re-entrancy attacks
        balances[msg.sender] = 0;
        if (msg.sender.send(amount)) {
            RevenueCollected(msg.sender, amount,now);
            return true;
        } else {
            balances[msg.sender] = amount;
            return false;
         }
    }

    /// function to verify Ticket's owner identity
    function verifyIdentity(address _addr, uint256 _hash) returns(bool){
        if(Identities[_addr] == _hash)
            return true;
        return false;
    }

        /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function numTickets(address user) public returns(uint){
       return TicketsOf[user].length;
    }
    
    /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function getTicket(address user, uint i) public returns(bytes,uint,uint,bytes32,uint){

            if(i < 0 || i > TicketsOf[user].length)
                return;
            bytes descriptions = bytes(TicketsOf[user][i].description);
            uint requestedTime = TicketsOf[user][i].requestedTime;
            uint emissionTimes = TicketsOf[user][i].emissionTime;
            bytes32 status = TicketsOf[user][i].status;
            uint numUsed = TicketsOf[user][i].numUsed;

        return (descriptions,requestedTime,emissionTimes,status,numUsed);
    }
	
	/// closing contract and send value to its creator
	function destroy()  onlyOwner{
	    suicide(owner);
		
	}
	
}
