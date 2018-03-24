var Escrow = artifacts.require("./Escrow.sol");

contract('Escrow', function (accounts) {
  it("should create new contract", function () {
    return Escrow.deployed().then(function (inst) {
      console.log('seller', inst.seller())
      return inst
    }).then(function (inst) {
      assert.equal(inst.sellerOk(), false)
      assert.equal(inst.buyerOk(), false)
      assert.equal(inst.buyer(), accounts[6])
      assert.equal(inst.seller(), accounts[5])
    });
  });
});
