pragma solidity ^0.4.17;

contract Store {
    enum ProductStatus { Sold, Unsold, Buying }
    uint public productIndex;

    mapping(address => mapping(uint => Product)) stores;
    mapping(uint => address) productIdInStore;

    struct Product {
        uint id;
        string name;
        string category;
        string imageLink;
        string description;
        uint price;
        ProductStatus status;
    }

    function Store() {

    }

    function addProduct(
        string _name,
        string _category,
        string _imageLink,
        string _description,
        uint _price
    ) {
        productIndex++;
        Product memory product = Product(
            productIndex,
            _name,
            _category,
            _imageLink,
            _description,
            _price,
            ProductStatus.Unsold
        );

        stores[msg.sender][productIndex] = product;
        productIdInStore[productIndex] = msg.sender;
    }

    function getProduct(uint _id) view public returns (
        uint, string, string, string, string, uint, ProductStatus
    ) {
        Product memory p = stores[productIdInStore[_id]][_id];
        return (
            p.id,
            p.name,
            p.category,
            p.imageLink,
            p.description,
            p.price,
            p.status
        );
    }
}