pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells concerning Transport Service  .*/
/** @author Giulia Di Bella .*/

contract Transport{ 

    // Transport Service's name
    string public ServiceName;
    // contract's owner
    address public owner;
    // Contract's balances 
    mapping(address => uint) public balances;
    // TicketsOf
    mapping (address => Ticket[]) public TicketsOf;
    //Type of Tickets
    enum TicketTypes{single,carnet,subscription}
    // Deposit quota
    uint public depositQuota ;
    uint public maxTime;
    
    // Struct represent a single Ticket 
    // initialized in configureTicket() by the owner
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
            // TODO: modify this part such that a user case withdraw by hismself
            // or cancel the operation mantain data consistency
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
    modifier onlyBefore(uint Timestamp){ if(now <= Timestamp) _; else throw;}
    modifier onlyAfter(uint Timestamp){ if(now > Timestamp) _; else throw;}
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport(string _name,
	                   uint _depositQuota,
	                   uint _maxTime) {
		owner = msg.sender;	
		ServiceName = _name;
        depositQuota = _depositQuota;
        maxTime = _maxTime;
	}
	
	
    // Step1 - User make a deposit and request a Ticket	
   function makeDeposit(string _description)
                        costs(depositQuota,msg.sender)
                        public payable{
        // check if exists already a non solved request
        if(balances[msg.sender] > 0)
            throw;
        // insert a new Pending request
        uint index = TicketsOf[msg.sender].length++;
        Ticket ticket = TicketsOf[msg.sender][index];
        ticket.requestedTime = now;
        ticket.description = _description;
        ticket.status = "requested";
        ticket.ticketHash = sha3(msg.sender,_description);
        balances[msg.sender] += depositQuota;
        DepositDone(msg.sender, depositQuota, ticket.ticketHash, now);
        }

    
	// Step2 - After Step1 Owner can configure the ticket for a certain user
    // or invalidate it if user not has inserted the correct price
    function configureTicket(address addr,
                             string _description,
                             uint _t,
                             uint index,
                             uint _expirationTime, 
                             uint _maxUses,
                             uint _price
                             ) onlyOwner
                               onlyBefore(TicketsOf[addr][index].requestedTime + maxTime)
                            public{
        
        Ticket ticket = TicketsOf[addr][index]; 
        if(ticket.ticketHash != sha3(addr,_description))
            throw;
        
        // Configure the ticket
        ticket.description = _description;
        ticket.t = TicketTypes(_t);
        ticket.emissionTime = now;
        ticket.expirationTime = _expirationTime;
        ticket.maxUses = _maxUses;
        ticket.numUsed = 0;
        ticket.price = _price;
        ticket.status = "emitted";
        // log this event
        TicketConfigured(addr, index, sha3(addr,_description), now);
        
    }


    // Step3 - User can buy a ticket
    function buyTicket(uint index)
                       costs(TicketsOf[msg.sender][index].price - depositQuota,msg.sender)
                       onlyBefore(TicketsOf[msg.sender][index].emissionTime + maxTime)
                       public payable{
            
            balances[owner] += TicketsOf[msg.sender][index].price;
            balances[msg.sender] = 0;
            TicketsOf[msg.sender][index].status = "valid";
            // log this event
            TicketPayed(msg.sender, TicketsOf[msg.sender][index].price, index, now);     
  		}
    
	function useTicket(uint index) onlyBefore(TicketsOf[msg.sender][index].expirationTime)
	                               public returns (bool){
	     //check if user has completed the purchased
        if(TicketsOf[msg.sender][index].status == "valid")
            throw;
	    Ticket ticket = TicketsOf[msg.sender][index];
	    // enum type   
	    if((ticket.t == TicketTypes.single && ticket.numUsed >= 1) ||
	       (ticket.t == TicketTypes.carnet && ticket.numUsed >= ticket.maxUses))
	            throw;
        
        ticket.numUsed++;  
	    //log this event
    	TicketUsed(msg.sender, index, now);
	 }

     /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function numTickets(address user) public returns(uint){
       return TicketsOf[user].length;
    }
    
       /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function getTicket(address user, uint i) public returns(bytes,uint,uint,bytes32){

            bytes descriptions = bytes(TicketsOf[user][i].description);
            uint requestedTime = TicketsOf[user][i].requestedTime;
            uint emissionTimes = TicketsOf[user][i].emissionTime;
            bytes32 status = TicketsOf[user][i].status;

        return (descriptions,requestedTime,emissionTimes,status);
    }


    // Withdraw deposit if DT does not retrive the ticket in time
    function withdrawDeposit(uint index) onlyValue 
                               onlyAfter(TicketsOf[msg.sender][index].requestedTime + maxTime)
                               returns(bool){
        
        // check if the tickets has been emitted
        if(TicketsOf[msg.sender][index].status == "emitted")
                throw;
        
        uint amount = balances[msg.sender];
        // Remember to zero the pending refund before
        // sending to avoid re-entrancy attacks
        balances[msg.sender] = 0;
        if (msg.sender.send(amount)) {
            DepositRefunded(msg.sender, amount,now);
            return true;
        } else {
            balances[msg.sender] = amount;
            return false;
         }
        
      
        
    }
    
    // Withdraw deposit if user does not buy the ticket in time
    function collectDeposit(uint index, address addr) 
                              onlyOwner 
                              onlyAfter(TicketsOf[addr][index].emissionTime + maxTime)
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
	
	/// closing contract and send value to its creator
	function destroy()  onlyOwner{
	    suicide(owner);
		
	}
	
}