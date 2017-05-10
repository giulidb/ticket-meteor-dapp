var userRegistry = artifacts.require("./userRegistry.sol");
<<<<<<< HEAD
var Event = artifacts.require("./Event.sol");

module.exports = function(deployer) {
    deployer.deploy(userRegistry);
    var eventTimestamp = 1498338000; // 06/24/2017 @9:00pm (UTC)
    deployer.deploy(Event,"Arcade Fire Concert",eventTimestamp);
=======

module.exports = function(deployer) {
    deployer.deploy(userRegistry);
>>>>>>> e533caff6526fa8bff05dc1de7b70d1f0e8af4fd
};