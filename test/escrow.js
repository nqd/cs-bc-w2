var Escrow = artifacts.require("./Escrow.sol");

contract('Escrow', function (accounts) {
  it("should create new contract", function () {
    let inst
    return Escrow.deployed().then(function (instance) {
      inst = instance
      return inst.buyer()
    }).then(function (buyer) {
      assert.equal(buyer, accounts[6])
      return inst.seller()
    }).then(seller => {
      assert.equal(seller, accounts[5])
      return inst.sellerOk()
    }).then(sellerOk => {
      assert.equal(sellerOk, false)
      return inst.buyerOk()
    }).then(buyerOk => {
      assert.equal(buyerOk, false)
    })
  })
})
