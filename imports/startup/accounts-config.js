/* Set the user account */

// Testrpc
Session.set('account', web3.eth.accounts[1]);
Session.set('coinbase', web3.eth.coinbase);

// Metamask
//Session.set('account', '0x2B6FBaCAF5EB6e56f8F558289d85b08A576AA283');
//Session.set('coinbase', '0xE48f8ddC796C42aa9C456f0eC06415d7FDCa085A')

// Both
Session.set('gasPrice', 100000000000);
Session.set('gas', 2500000);
