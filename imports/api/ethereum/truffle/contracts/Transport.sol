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
    // Rights to buy
    mapping (address => bool) rights;
    // Arrays of different kind of tickets
    Tickets[] public allTickets;
    
    //Type of Tickets
    struct Tickets{
         bytes32 typeDescription;
         uint ticketSold;
         mapping (address => Ticket[]) ticketOf;

    }

    // Struct represent a single Ticket 
    // initialized in....
    struct Ticket{
            bytes32 ticketDescription;
            uint emissionDate;
            uint expirationDate;
            uint maxUses;
            uint numUsed;
            uint checkedNum;
            uint price;
    }


    // Use of an event to pass along return values from contracts, 
	// to an app's frontend
  	event TicketTypeAdded(bytes32 description, uint _timestamp);
	event TicketPayed(address _from, uint _amount, uint _id, uint _timestamp);
  	event TicketChecked(address _user, uint _timestamp);
	event Checkin(address _to, uint _type, uint _timestamp);
	event RevenueCollected(address _owner, uint _amount, uint _timestamp);
    event UserRefunded(address _to, uint _amount);
	
	// This means that if the owner calls this function, the
	// function is executed and otherwise, an exception is
	// thrown.
	modifier onlyOwner {TicketTypeAdded
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
    
    
    // This modifier requires a certTicketTypeAddedain
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
    TicketTypeAdded
    //This means that only users with token auth right can call a function
    //modifier onlyRight() {if( rights[msg.sender] == true ) _; else throw; }
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport
    (bytes32 _name, address _controller) {
		owner = msg.sender;	
        controller = controller;
		ServiceName = _name;
	}


    // Initialize ticket type by contract's owner
    function addTicketType(bytes32 _description
                        ) onlyOwner public{
            allTickets.push(Tickets({description: _description,
                                     ticketSold: 0}));                    
            TicketTypeAdded(_description, now);
    }
	
	
    // Step1 - User buyTicket	
    function buyTicket(bytes32 _description,uint _type,uint _price)
                       costs(_price,msg.sender) public payable{
                        balances[msg.sender] = _price;
             
  		}

    
	// Step2 - After Step1 Owner can configure the ticket for a certain user
    // or invalidate it if user not has inserted the correct price
    function configureTicket() onlyOwner public{
            
    }

pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells concerning Transport Service  .*/
/** @author Giulia Di Bella .*/

contract Transport{ 

    // contract's owner
    address public owner;
    // controller's address
    address public controller;
    // Transport Service's name
    bytes32 public ServiceName;
    // Contract's balances 
    mapping(address => uint) public balances;
    // Rights to buy
    mapping (address => bool) rights;
    // AllTickets
    mapping (address => Ticket[]) AllTickets;
    //Type of Tickets
    

    // Struct represent a single Ticket 
    // initialized in configureTicket() by the owner
    struct Ticket{
            bytes32 description;
            bytes32 _type;
            uint emissionDate;
            uint expirationDate;
            uint maxUses;
            uint numUsed;
            uint checkedNum;
            uint price;
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
        if (msg.value < _amount)pragma solidity ^0.4.0;
import "./userRegistry.sol";


/** @title Contract for tickets sells concerning Transport Service  .*/
/** @author Giulia Di Bella .*/

contract Transport{ 

    // contract's owner
    address public owner;
    // controller's address
    address public controller;
    // Transport Service's name
    bytes32 public ServiceName;
    // Contract's balances 
    mapping(address => uint) public balances;
    // Rights to buy
    mapping (address => bool) rights;
    // AllTickets
    mapping (address => Ticket[]) AllTickets;
    //Type of Tickets
    

    // Struct represent a single Ticket 
    // initialized in configureTicket() by the owner
    struct Ticket{
            bytes32 description;
            bytes32 _type;
            uint emissionDate;
            uint expirationDate;
            uint maxUses;
            uint numUsed;
            uint checkedNum;
            uint price;
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
    
    //This means that only users with token auth right can call a function
    //modifier onlyRight() {if( rights[msg.sender] == true ) _; else throw; }
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport
    (bytes32 _name, address _controller) {
		owner = msg.sender;	
        controller = controller;
		ServiceName = _name;
       

	}
	
	
    // Step1 - User buyTicket	
    function buyTicket(bytes32 _description,uint _type,uint _price)
                       costs(_price,msg.sender) public payable{
                        balances[msg.sender] = _price;
             
  		}

    
	// Step2 - After Step1 Owner can configure the ticket for a certain user
    // or invalidate it if user not has inserted the correct price
    function configureTicket() onlyOwner public{
            
    }


   function invalidateTicket() onlyOwner public{
            
    }
    
	
	function useTicket(uint _type) public returns (bool){
	 
	}

    
    function checkTicket(uint _type, address _user) onlyController public returns (bool){
	    
            TicketChecked(_user, now);
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
    //modifier onlyRight() {if( rights[msg.sender] == true ) _; else throw; }
    
	
	/// This is the constructor whose code is
    /// run only when the contract is created.	
	function Transport
    (bytes32 _name, address _controller) {
		owner = msg.sender;	
        controller = controller;
		ServiceName = _name;
       

	}
	
	
    // Step1 - User buyTicket	
    function buyTicket(bytes32 _description,uint _type,uint _price)
                       costs(_price,msg.sender) public payable{
                        balances[msg.sender] = _price;
             
  		}

    
	// Step2 - After Step1 Owner can configure the ticket for a certain user
    // or invalidate it if user not has inserted the correct price
    function configureTicket() onlyOwner public{
            
    }


   function invalidateTicket() onlyOwner public{
            
    }
    
	
	function useTicket(uint _type) public returns (bool){
	 
	}

    
    function checkTicket(uint _type, address _user) onlyController public returns (bool){
	    
            TicketChecked(_user, now);
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
   function invalidateTicket() onlyOwner public{
            
    }
    
	
	function useTicket(uint _type) public returns (bool){
	 
	}

    
    function checkTicket(uint _type, address _user) onlyController public returns (bool){
	    
            TicketChecked(_user, now);
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