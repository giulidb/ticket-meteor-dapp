pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells concerning Events  .*/
/** @author Giulia Di Bella .*/

contract Event{ 

    // contract's owner
    address public owner;
    // Event's name
    bytes32 public name;
    // Arrays of different kind of tickets
    Tickets[] public allTickets;
    // Block timestamp dependance is a security issue: miners set 
    // the timestamp for the block. Normally, the timestamp is 
    // set as the current time of the miner’s local system. 
    // However he can vary this value by roughly 900 seconds,
    // while still having other miners accept the block.
    // Alternatively can be used block numbers.
    uint public eventTime;
    uint public MAX_TICKETS;
    // Contract's balance 
    uint public incomes;

    // Struct of diffent kind of Tickets
    struct Tickets{
         bytes32 description;
         uint ticketPrice;
         uint numTickets;
         uint ticketSold;
         mapping (address => Ticket) ticketOf;

    }
    
    // Struct of a bulk of one or more tickets owned by some user
    struct Ticket{
        uint num;
        bool used;
    }


    // Use of an event to pass along return values from contracts, 
	// to an app's frontend
	event TicketPayed(address _from, uint _amount, uint _id, uint _timestamp);
	event Checkin(address _to, uint _type, uint _timestamp);
	event RevenueCollected(address _owner, uint _amount, uint _timestamp);
	event TicketsAdded(bytes32 description, uint ticketPrice, uint numTickets);
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
    modifier onlyValue() { if(incomes  > 0 ) _; else throw; }
      
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Event
    (bytes32 _name, uint _eventTime, uint _MAXTICKETS, address userRegistryAddr) {
		owner = msg.sender;	
		name = _name;
        eventTime = _eventTime;
        MAX_TICKETS = _MAXTICKETS;
        u = userRegistry(userRegistryAddr);
		incomes = 0;

	}
	
	function addTickets(bytes32 _description,
	                    uint _ticketPrice,
	                    uint _numTickets) onlyOwner public{
            allTickets.push(Tickets({description: _description, ticketPrice: _ticketPrice, numTickets: _numTickets,ticketSold: 0}));                    
            TicketsAdded(_description, _ticketPrice, _numTickets);
    }


    function compute_price(uint _type, uint _num) public returns(uint){
        uint _unitaryPrice = allTickets[_type].ticketPrice;
        return _unitaryPrice*_num;
    }
    

	function buyTicket(uint _type,uint _num)
       costs(compute_price(_type,_num),msg.sender) public payable{
	    
       // Sending back the money by simply using
       // organizer.send(tickePrice) is a security risk
       // because it can be prevented by the caller by e.g.
       // raising the call stack to 102 _tic3. It is always safer
       // to let the recipient withdraw their money themselves.	    
      
        Tickets t = allTickets[_type];
	    if(t.ticketSold + _num > t.numTickets || _num > MAX_TICKETS){
	       // throw ensures funds will be returned
	       throw;
	   }
	    
	    t.ticketSold += _num;
	    incomes += compute_price(_type,_num);
	    t.ticketOf[msg.sender] = Ticket({num: _num, used:false});
	    TicketPayed(msg.sender, msg.value,t.ticketOf[msg.sender].num,now);
	    	
	}
	
	function useTicket(uint _type) public returns (bool){
	    Tickets t = allTickets[_type];
	    if(t.ticketOf[msg.sender].num == 0 || t.ticketOf[msg.sender].used == true){
	        return false;
        }else{
           
	        t.ticketOf[msg.sender].used = true;
	        Checkin(msg.sender,_type,now);
	        return true;
	    }
	}

    /// Function to retrieve all the Tickets in the contract
    function getTickets() public returns(bytes32[],uint[],uint[],uint[]){
        uint length = allTickets.length;
        bytes32[] memory descriptions = new bytes32[](length);
        uint[] memory ticketPrices = new uint[](length);
        uint[] memory ticketsLeft = new uint[](length);
        uint[] memory numTickets = new uint[](length);

        for(uint i = 0; i < length; i++){
            descriptions[i] = allTickets[i].description;
            ticketPrices[i] = allTickets[i].ticketPrice;
            ticketsLeft[i] = allTickets[i].numTickets - allTickets[i].ticketSold;
            numTickets[i] = allTickets[i].numTickets;
        }

        return (descriptions,ticketPrices,ticketsLeft,numTickets);

    }


    /// Function to get user ticket id eventually returns 0 if 
    /// user has not bought any tickets.
    function getTicket(address _user, uint _type) public returns(uint ,bool){
        Tickets t = allTickets[_type];
        return (t.ticketOf[_user].num, t.ticketOf[_user].used);
    }


     /// Function to retrieve all the Tickets in the contract
    function getLeftTickets(uint _type) public returns(uint){
        Tickets t = allTickets[_type];
        return t.numTickets - t.ticketSold;

    }

  	
    /// Withdraw pattern fot the organizer
	function withdraw() onlyValue onlyOwner public returns(bool){
	    
        uint amount = incomes;
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        incomes = 0;
        if (msg.sender.send(amount)) {
            RevenueCollected(msg.sender, amount,now);
            return true;
        } else {
            incomes = amount;
            return false;
         }
    }
	
	/// closing contract and send value to its creator
	function destroy()  onlyOwner{
	    suicide(owner);
		
	}
	
}