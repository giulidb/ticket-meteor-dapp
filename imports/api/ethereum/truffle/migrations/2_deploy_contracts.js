var userRegistry = artifacts.require("./userRegistry.sol");

module.exports = function(deployer) {
    deployer.deploy(userRegistry);
};