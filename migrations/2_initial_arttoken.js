const TokenFactory = artifacts.require("ArtToken");

module.exports = function (deployer) {
  deployer.deploy(TokenFactory);
};
