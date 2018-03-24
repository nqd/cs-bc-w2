// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import escrow_artifacts from '../../build/contracts/EscrowFactory.json'
import escrow_contract from '../../build/contracts/Escrow.json'
import store_artifacts from '../../build/contracts/Store.json'

// escrow is our usable abstraction, which we'll use through the code below.
var EscrowFactory = contract(escrow_artifacts);
var Escrow = contract(escrow_contract);
var Store = contract(store_artifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function () {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    EscrowFactory.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

    });

    EscrowFactory.deployed().then(function (instance) {
      var createdEvent = instance.EscrowCreated();
      createdEvent.watch((err, res) => {
        let escrowContract = web3.eth.contract(Escrow.abi).at(res.args.newAddress);
        // Interact with the newly escrow contract here.

      })
    });

    // get all the stores
    Store.setProvider(web3.currentProvider);
    renderStore();


    $('#create-escrow').on('click', function (e) {
      createEscrow();
    });
  },
};

async function renderStore() {
  console.log("render store")
  let i = await Store.deployed();
  let product = await i.getProduct.call(1)
  console.log(product)
  $("#product-list").append(buildProduct(product))
}

function buildProduct(p) {
  return `<div><h1>${p[1]}</h1></div>`
}

let createEscrow = async function () {
  var amount = parseInt($("#amount").val());
  var seller = $("#seller").val();

  this.setStatus("Creating escrow contract... (please wait)");

  let instance = await EscrowFactory.deployed();
  let createdContract = await instance.createEscrow(seller, { from: account, gas: 1000000, value: web3.toWei(amount, 'ether') });

  // Update UI status here.
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});