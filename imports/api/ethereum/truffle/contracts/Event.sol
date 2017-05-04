pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells  .*/
/** @author Giulia Di Bella .*/

contract Event{ 

    address public owner;

	

    // Unitary ticketPrice
    uint public ticketPrice;
    uint public ticketSold;
    mapping (address => uint) balances;
    mapping (address => bool) rights;
    mapping (address => Ticket) ticketOf;

    uint public owner_percentage;


    //TODO: to include different kind of tickets insert
    //also struct TicketType;
    struct Ticket{
        uint num;
        string description;
        
        // Block timestamp dependance is a security issue: miners set 
        // the timestamp for the block. Normally, the timestamp is 
        // set as the current time of the miner’s local system. 
        // However he can vary this value by roughly 900 seconds,
        // while still having other miners accept the block.
        // Alternatively can be used block numbers.
        uint timestamp;
        // TODO: altre info
    }


    // Use of an event to pass along return values from contracts, 
	// to an app's frontend
	event TicketPayed(address _from, uint _amount, uint _id, uint _timestamp);
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
    //only if incomes > 0
    modifier onlyValue() { if(balances[msg.sender]  > 0 ) _; else throw; }
    
    //This means that only users with token auth right can call a function
    modifier onlyRight() {if( rights[msg.sender] == true ) _; else throw; }
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Event
    (uint _eventTime, uint _ticketPrice, address _sp, uint _op) {
		owner = msg.sender;	
 		ticketPrice = _ticketPrice;
 		ticketSold = 0;
	}
	
    /// This is the constructor whose code is
    /// run only when the contract is created.	
	function userRegistry() {
		owner = msg.sender;        
	}

    // Give `user` the right to buy ticket on contracts.
    // May only be called by `owner`.
    // This means that owner can open the contract only to 
    // registered user to an internal db.
    function giveRightToUse(address user) onlyOwner public {
        rights[user] = true;
    }

    // Remove `user` the right to buy ticket on contracts.
    // May only be called by `owner`.
    // This means that owner can open the contract only to 
    // registered user to an internal db.
    function removeRightToUse(address user) onlyOwner public {
        rights[user] = false;
    }


	function buyTicket() costs(ticketPrice,msg.sender) 
    onlyRight() public payable{
	    
       // Sending back the money by simply using
       // organizer.send(tickePrice) is a security risk
       // because it can be prevented by the caller by e.g.
       // raising the call stack to 1023. It is always safer
       // to let the recipient withdraw their money themselves.	    
       
	   if(ticketOf[msg.sender].num != 0){
	       // throw ensures funds will be returned
	       throw;
	   }
	
	    ticketSold++;

        //Add own_% to owner and 100-own_% to the service provider
	    balances[owner] += ticketPrice*owner_percentage/100;

        //TODO: change state of the ticket to assert that now belong to
        // msg.sender address
        //TODO: decide which information insert by contract computing 
        //or by external data source, using oracles eventually.
	    TicketPayed(msg.sender, msg.value,ticketOf[msg.sender].num,now);
	    	
	}


    /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function getTicket(address user) public returns(uint){
        return (ticketOf[user].num);
    }
	
	
    /// Withdraw pattern fot the organizer
	function withdraw() onlyValue public returns(bool){
	    
        uint amount = balances[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
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