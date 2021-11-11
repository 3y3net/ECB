const CBDC = artifacts.require("CBDC");

module.exports = function (deployer) {
  deployer.deploy(CBDC, 100);
};
