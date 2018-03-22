
pragma solidity ^0.4.17;

contract Escrow {
    address public buyer;
    address public seller;
    uint createdAt;
    uint buyerOk;
    uint sellerOk;

    function Escrow(address _seller, address _sender) public payable {
        buyer = _sender;
        seller = _seller;
        createdAt = block.timestamp;
    }

    function accept() public {
        if (msg.sender == buyer) {
            //TODO: Handle buyerOK
            buyerOk = now;
        } 

        if (msg.sender == seller) {
            // TODO: Seller Ok
            sellerOk = now;

        }
        if (buyerOk != 0 && sellerOk != 0) {
            seller.send(this.balance);
        }

    } 

    function reject() public {
        if (msg.sender == buyer) {
            //TODO: Handle buyerOK
            buyerOk = 0;
        } 

        if (msg.sender == seller) {
            // TODO: Seller Ok
            sellerOk = 0;
        }
    }
}

contract EscrowFactory {
    event EscrowCreated(address newAddess);

    function EscrowFactory() public {}

    function createEscrow(address seller) public {

        address newAddress = address((new Escrow).value(msg.value)(msg.sender,seller));
        EscrowCreated(newAddress);
    }
}