var Escrow = artifacts.require("./Escrow.sol");

contract('Escrow', function (accounts) {
  const buyer = accounts[6]
  const seller = accounts[5]

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

  it('should allow both user aggree on the contract', () => {
    let currentSellerBalance = web3.eth.getBalance(seller).toNumber()
    let inst
    return Escrow.deployed().then((instance) => {
      inst = instance
      return inst
    }).then(_instance => {
      // seller accept
      return inst.accept(true, { from: seller })
    }).then(_instance => {
      inst.accept(true, { from: buyer }).then(() => {
        return inst
      })
    }).then(_instance => {
      expect(web3.eth.getBalance(seller).toNumber(), currentSellerBalance + web3.toWei(1))
    })
  })
})
