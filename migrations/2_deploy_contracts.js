var Web3 = require("../node_modules/web3/")
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

var Escrow = artifacts.require("Escrow")
var EscrowFactory = artifacts.require("EscrowFactory")
var Store = artifacts.require("Store")

module.exports = function (deployer) {
  deployer.deploy(
    Escrow,
    web3.eth.accounts[1], // provider
    web3.eth.accounts[5],
    { from: web3.eth.accounts[6], value: web3.toWei(10) }
  )
  deployer.deploy(
    EscrowFactory,
    { from: web3.eth.accounts[0] }
  )
  deployer.deploy(
    Store,
    { from: web3.eth.accounts[0] }
  )
}
