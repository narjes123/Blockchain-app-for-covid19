const CovidApp = artifacts.require("CovidApp");

module.exports = function (deployer) {
  deployer.deploy(CovidApp);
};