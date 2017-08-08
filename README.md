# Ethereum Ticketing Application
Ethereum Ticketing Application to buy tickets for events and trains based on smart contracts written in Solidity and running on the Ethereum Blockchain. This application has been developed with Meteor and React.js.

## Install
Install [testrpc](https://github.com/ethereumjs/testrpc)

```
$npm install -g ethereumjs-testrpc
```

Install [meteor](https://www.meteor.com)
```
$curl https://install.meteor.com/ | sh
```

Install [truffle](https://github.com/consensys/truffle):

```
$ npm install -g truffle 
```

## Usage
Run testrpc in a console window
```
$ npm testrpc
```
Open another console windowm to compile and migrate contracts with truffle 

```
$ cd ticket-meteor-dapp/imports/api/ethereum/truffle/contracts/
$ truffle compile
$ truffle migrate
```
Run client application with meteor
```
$ cd ticket-meteor-dapp
$ meteor
```
Open `localhost:3000` on a web browser

## Smart Contracts
Code for smart contracts `event.sol` and `transport.sol` is published in folder:
`ticket-meteor-dapp/imports/api/ethereum/truffle/contracts/`

## User Interface
Example of User Interface:

<p align="center">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/EventList.png" width="600">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/EventExample.png" width="600">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/TrainSearch.png" width="600">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/TrainTicketDeposit.png" width="600">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/Exchange.png" width="600">
<img src="https://github.com/giulidb/ticket-meteor-dapp/blob/master/Admin.png" width="600">
</p>



