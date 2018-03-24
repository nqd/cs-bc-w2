var Escrow = artifacts.require("./Escrow.sol");

contract('Escrow', function (accounts) {
  it("should create new contract", function () {
    let inst
    return Escrow.deployed().then(function (instance) {
      inst = instance
      return inst.buyer()
    }).then(function (buyer) {
      console.log('buyer = ', buyer)
      assert.equal(buyer, accounts[6])
      // assert.equal(inst.buyer(), accounts[6])
      // assert.equal(inst.sellerOk.call(), false)
      // assert.equal(inst.buyerOk.call(), false)
      // assert.equal(inst.buyer(), accounts[6])
      // assert.equal(inst.seller(), accounts[5])
    });
  });
});
