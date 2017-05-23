pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells concerning Transport Service  .*/
/** @author Giulia Di Bella .*/

contract Transport{ 

    // Transport Service's name
    bytes32 public ServiceName;
    // contract's owner
    address public owner;
    // controller's address
    address public controller;
    // Contract's balances 
    mapping(address => uint) public balances;
    // AllTickets
    mapping (address => Ticket[]) AllTickets;
    mapping (address => bytes32[]) PendingRequests;
    //Type of Tickets
    enum TicketTypes{single,carnet,subscription}
    // UserRegistry contract's instance
    userRegistry u;
    // Deposit quota
    uint depositQuota;
    uint maxTime;
    
    // Struct represent a single Ticket 
    // initialized in configureTicket() by the owner
    struct Ticket{
            string description;
            TicketTypes t;
            uint emissionDate;
            uint expirationDate; 
            uint maxUses; //unused for temporal subscription tickets.        
            uint numUsed;
            uint checkedNum;
            uint price;
            bytes32 ticketHash;
    }


    // Use of an event to pass along return values from contracts, 
	// to an app's frontend
	event TicketPayed(address _from, uint _amount, uint _id, uint _timestamp);
  	event TicketChecked(address _user, uint _timestamp);
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

    // This means that if the controller calls this function, the
	// function is executed and otherwise, an exception is
	// thrown.
    modifier onlyController {
		if (msg.sender != controller)
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
    
    // Block timestamp dependance is a security issue: miners set 
    // the timestamp for the block. Normally, the timestamp is 
    // set as the current time of the miner’s local system. 
    // However he can vary this value by roughly 900 seconds,
    // while still having other miners accept the block.
    // Alternatively can be used block numbers.
    modifier onlyBefore(uint Timestamp){ if(now <= Timestamp) _; else throw;}
    modifier onlyAfter(uint Timestamp){ if(now > Timestamp) _; else throw;}
    
    //This means that only users with token auth right can call a function
    modifier onlyRight() {if( u.getRight(msg.sender) == true ) _; else throw; }
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport(bytes32 _name,
	                   address _controller,
	                   address userRegistryAddr,
	                   uint _depositQuota,
	                   uint _maxTime) {
		owner = msg.sender;	
        controller = _controller;
		ServiceName = _name;
        u = userRegistry(userRegistryAddr);
        depositQuota = _depositQuota;
        maxTime = _maxTime;
	}
	
	
    // Step1 - User buyTicket	
   function makeDeposit(bytes32 transactionHash) onlyRight 
                          costs(depositQuota,msg.sender)
                          public payable{
        balances[msg.sender] += msg.value;
        PendingRequests[msg.sender].push(transactionHash);                      

                          }

    
	// Step2 - After Step1 Owner can configure the ticket for a certain user
    // or invalidate it if user not has inserted the correct price
    function configureTicket(address addr,
                             uint index,
                             string description,
                             TicketTypes t,
                             uint expirationDate, 
                             uint maxUses,
                             uint price
                             ) onlyOwner public{
        
        Ticket ticket = AllTickets[addr][index];
        if(ticket.ticketHash != sha3(addr,description,price,t,expirationDate,maxUses))
            throw;
            
    }


    // Step3 - User can buy a ticket
   function buyTicket(bytes32 _description,uint _type,uint _price)
                       costs(_price,msg.sender)
                       onlyRight
                       public payable{
        balances[msg.sender] = _price;
             
  		}
    
	
	function useTicket(uint index) onlyRight public returns (bool){
	 
	}

    
    function checkTicket(uint index, address _user) onlyController public returns (bool){
	    
            TicketChecked(_user, now);
	}


    // Withdraw deposit if DT does not retrive the ticket in time
    function withdrawDeposit() onlyAfter(maxTime){
        
    }
 
  	
    /// Withdraw pattern fot the organizer
	function withdraw() onlyValue public returns(bool){
	    
        uint amount = balances[msg.sender];
        // Remember to zero the pending refund before
        // sending to prTransport re-entrancy attacks
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