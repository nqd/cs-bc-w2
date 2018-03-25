pragma solidity ^0.4.17;

contract EscrowFactory {
    address public provider;

    event EscrowCreated(address newAddress);

    function EscrowFactory() public {
        provider = msg.sender;
    }

    function createEscrow(address seller) public payable {
        address addr = address((new Escrow).value(msg.value)(provider, seller));

        EscrowCreated(addr);
    }
}

contract Escrow {
    address public provider;
    address public buyer;
    address public seller;
    bool public buyerOk = false;
    bool public sellerOk = false;
    uint createdAt = 0;

    function Escrow(address _provider, address _seller) public payable {
        require(_seller != 0);
        require(_provider != 0);
        provider = _provider;
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

        if (sellerOk && buyerOk) {
            release();
        }
    }

    function release() internal {
        uint balance = this.balance;
        provider.transfer(balance / 100); // 1% fee
        seller.transfer(balance * 99 / 100);
        // selfdestruct(seller);
    }
}
