/* Set the user account */

// Testrpc
Session.set('account', web3.eth.accounts[1]);
Session.set('coinbase', web3.eth.coinbase);

// Metamask
//Session.set('account', '0xdbCe86f51D7971cff5a7C92b3D694A00D0702D1c');
//Session.set('coinbase', '0xdbCe86f51D7971cff5a7C92b3D694A00D0702D1c')

// Both
Session.set('gasPrice', 100000000000);
Session.set('gas', 2500000);


