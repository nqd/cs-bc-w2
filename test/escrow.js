var Escrow = artifacts.require("Escrow");
var EscrowFactory = artifacts.require("EscrowFactory");

contract('Escrow', function (accounts) {
  const provider = accounts[0]
  const buyer = accounts[6]
  const seller = accounts[5]

  it.skip("should create new contract", function () {
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
      return inst.accept(true, { from: buyer })
    }).then(_instance => {
      // console.log(web3.eth.getBalance(seller).toNumber(),'current seller balance')
      // console.log(currentSellerBalance, 'last seller balance')
      // console.log(web3.toWei(1), 'transit')
      assert.equal(web3.eth.getBalance(seller).toNumber(), currentSellerBalance + web3.toWei(1))
    })
  })
})

contract('EscrowFactory', accounts => {
  const buyer = accounts[6]
  const seller = accounts[5]
  it.skip("should create generate new contract", function () {
    let fi
    let event
    return EscrowFactory.deployed().then((instance) => {
      fi = instance
      event = fi.EscrowCreated()
      event.watch((err, res) => {
        console.log('err', err)
        console.log('res', res)
        let escrowContract = web3.eth.contract(Escrow.abi).at(res.args.newAddress);
        console.log(escrowContract)
      })
      return fi.createEscrow(seller, {
        from: buyer,
        value: web3.toWei(0.5)
      })
    })
      // .then(_contractInstance => {
      //   console.log('_contractInstance', _contractInstance)
      // })
  })
})