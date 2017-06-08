var userRegistry = artifacts.require("./userRegistry.sol");
var Event = artifacts.require("./Event.sol");

module.exports = function(deployer) {
    deployer.deploy(userRegistry);
    var eventTimestamp = 1498338000; // 06/24/2017 @9:00pm (UTC)
    deployer.deploy(Event, "Arcade Fire Concert", eventTimestamp, 4);
};