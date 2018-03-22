pragma solidity ^0.4.17;

contract EscrowFactory {
    event EscrowCreated(address newAddress);

    function EscrowFactory() public {}

    function createEscrow(address seller) public payable {
        address addr = address((new Escrow).value(msg.value)(seller));

        EscrowCreated(addr);
    }
}

contract Escrow {
    address public buyer;
    address public seller;
    bool public buyerOk = false;
    bool public sellerOk = false;
    uint createdAt = 0;

    function Escrow(address _seller) public payable {
        require(_seller != 0);
        buyer = msg.sender;
        seller = _seller;
        createdAt = now;
    }

    function accept(bool _accepted) public {
        require(msg.sender == buyer || msg.sender == seller);
        
        if (_accepted == false) {
            selfdestruct(buyer);
        }

        if (msg.sender == seller) {
            sellerOk = _accepted;
        } else {
            buyerOk = _accepted;
        }

        if(sellerOk && buyerOk) {
            selfdestruct(seller);
        }
    }
}
