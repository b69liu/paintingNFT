const ArtToken = artifacts.require("ArtToken");

module.exports = function (deployer) {
  deployer.deploy(ArtToken, 6, [0,1,2,3,4,5].map((id)=>`https://addresstotoken${id}.json`));
};
