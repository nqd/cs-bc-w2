var Web3 = require("../node_modules/web3/");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

var Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
  deployer.deploy(Escrow, web3.eth.accounts[0], web3.eth.accounts[0], { from: web3.eth.accounts[1], value: 1000000 });
};
