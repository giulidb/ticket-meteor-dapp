import { Meteor } from 'meteor/meteor';
import web3, { selectContractInstance, mapReponseToJSON } from '../../api/ethereum/web3.js';
import userRegistry_artifacts from '../../api/ethereum/truffle/build/contracts/userRegistry.json'

// Transactions Parameters
const fromAddr = web3.eth.coinbase;
const gasPrice = 100000000000;
const gas = 2500000;

Meteor.methods({

    'giveRight' (contractAddress, userAddress) {
        var userRegistry = await selectContractInstance(userRegistry_artifacts, Session.get("reg_address"));
        await userRegistry.giveRightToUse(userAddress, { from: fromAddr, gasPrice: gasPrice, gas: gas });
        console.log("Transaction GiveRight done!");
    }
});