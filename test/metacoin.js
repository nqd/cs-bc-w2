var Escrow = artifacts.require("./Escrow.sol");

contract('Escrow', function (accounts) {
  it("should create new contract", function () {
    return Escrow.deployed().then(function (instance) {
      console.log(web3.eth.getBalance(accounts[0]))
      return instance.getBalance.call(accounts[0]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
});
