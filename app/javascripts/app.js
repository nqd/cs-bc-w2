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

const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');
const ipfs = ipfsAPI({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
});

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

function buyThisProduct(id) {
  alert('product id', id)
}
function myFunction(id) {
  alert('product id', id)
}

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

    let reader;
    $("#product-image").on("change", (event) => {
      const file = event.target.files[0];
      reader = new window.FileReader();
      reader.readAsArrayBuffer(file)
    })

    $("#add-product-form").on("submit", e => {
      e.preventDefault();
      saveProduct(reader,
        $("#product-name").val(),
        $("#product-category").val(),
        $("#product-description").val(),
        parseFloat($("#product-price").val())
      );
    })
  },
};

async function saveProduct(
  fileReader,
  productName,
  productCategory,
  productDescription,
  productPrice
) {
  let response = await saveImageOnIpfs(fileReader);
  let imageId = response[0].hash;

  let i = await Store.deployed();
  let res = await i.addProduct(
    productName,
    productCategory,
    imageId,
    productDescription,
    web3.toWei(productPrice, "ether"),
    { from: web3.eth.accounts[0], gas: 4700000 }
  );

  alert("product added");
}
function saveImageOnIpfs(reader) {
  const buffer = Buffer.from(reader.result);
  return ipfs.add(buffer)
}

async function renderStore() {
  console.log("render store")
  let i = await Store.deployed();
  let product = await i.getProduct.call(0)
  $("#product-list").append(buildProduct(product))
  product = await i.getProduct.call(1)
  $("#product-list").append(buildProduct(product))
}
function createBuyButton(product){
  const buyButton = document.createElement('button');
  buyButton.className = 'btn btn-primary';
  buyButton.onclick = function() {
    const quantity = document.getElementById(`quantity${product[0]}`).value
    
    alert(quantity)
  }
  buyButton.id = `button${product[0]}`;
  buyButton.innerText='Buy'
  return buyButton;
}

function createInputQuantity(product){
  const inputQuantity = document.createElement('input');
  inputQuantity.type = 'text';
  inputQuantity.className = 'form-control';
  inputQuantity.id = `quantity${product[0]}`;
  return inputQuantity;
}
function createProductImg (product){
  const img = document.createElement('img');
  img.src = `http://localhost:8080/ipfs/${product[3]}`;
  img.className = 'card-img-top';
  img.width=100;

  return img;
}
function createProductTitle(product){
  const productTitle = document.createElement('p');
  productTitle.className = 'card-text';
  productTitle.innerHTML = product[1];
  return productTitle
}
function buildProduct(product) {
  const productElement = document.createElement('div');
  productElement.className = 'card mb-8 box-shadow';
  productElement.appendChild(createProductTitle(product));
  productElement.appendChild(createProductImg(product));
  productElement.appendChild(createInputQuantity(product));
  productElement.appendChild(createBuyButton(product));
  return productElement
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
