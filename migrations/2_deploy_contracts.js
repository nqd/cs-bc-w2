var Web3 = require("../node_modules/web3/");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

var Escrow = artifacts.require("Escrow");
var EscrowFactory = artifacts.require("EscrowFactory");

module.exports = function (deployer) {
  // deployer.deploy(
  //   Escrow,
  //   web3.eth.accounts[5],
  //   { from: web3.eth.accounts[6], value: web3.toWei(1) }
  // )
  //   .then(() => {
      deployer.deploy(
        EscrowFactory,
        { from: web3.eth.accounts[4] }
      )
    // })
};
