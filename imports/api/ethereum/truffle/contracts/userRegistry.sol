pragma solidity ^0.4.0;

/** @title Contract for tickets sells  .*/
/** @author Giulia Di Bella .*/

contract userRegistry{ 

    address public owner;
    mapping (address => bool) rights;

    // This means that if the owner calls this function, the
	// function is executed and otherwise, an exception is
	// thrown.
	modifier onlyOwner {
		if (msg.sender != owner)
			throw;
		_;
	}

    /// This is the constructor whose code is
    /// run only when the contract is created.	
	function userRegistry() {
		owner = msg.sender;        
	}

    // Give `user` the right to buy ticket on this contract.
    // May only be called by `owner`.
    // This means that owner can open the contract only to 
    // registered user to an internal db.
    function giveRightToUse(address user) onlyOwner public {
        rights[user] = true;
    }
    
    // external means that can be called by external contracts

    function getRight(address user) public returns(bool){
        return rights[user];
    }
    
}


