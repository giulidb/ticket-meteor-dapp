var Conference = artifacts.require("./Conference.sol");
module.exports = function(deployer) {
  deployer.deploy(Conference);
  //deployer.autolink(); // for linking imports of other contracts
};
