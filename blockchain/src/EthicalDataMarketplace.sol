// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EthicalDataMarketplace {
    struct Dataset {
        address owner;
        string cid;
        uint256 price;
        bool purchased;
    }

    mapping(uint256 => Dataset) public datasets;
    uint256 public datasetCount;

    event DatasetUploaded(uint256 id, string cid, uint256 price, address owner);
    event DatasetPurchased(uint256 id, address buyer, address seller);

    function uploadDataset(string memory _cid, uint256 _price) public {
        datasets[datasetCount] = Dataset(msg.sender, _cid, _price, false);
        emit DatasetUploaded(datasetCount, _cid, _price, msg.sender);
        datasetCount++;
    }

    function buyDataset(uint256 _id) public payable {
    require(msg.value == datasets[_id].price, "Incorrect amount");
    require(!datasets[_id].purchased, "Already purchased");

    address seller = datasets[_id].owner;
    payable(seller).transfer(msg.value);
    datasets[_id].purchased = true;
    emit DatasetPurchased(_id, msg.sender, seller);
}


    function getDataset(uint256 _id) public view returns (string memory) {
        require(datasets[_id].purchased, "Not purchased yet");
        return datasets[_id].cid;
    }
}
