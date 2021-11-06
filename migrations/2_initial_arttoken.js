const ArtToken = artifacts.require("ArtToken");
const uriArray = require('../uris.json');


module.exports = function (deployer) {
  deployer.deploy(ArtToken, 6, Array(6).fill(0).map((id,index)=>uriArray[index]));
};
