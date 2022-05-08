//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Index.sol";

contract IndexDeployer {
    address owner;
    address[] public indexes;

    event LogDeployedIndexContract(address child);

    mapping(uint256 => address) nativeCurrenciesByChainId;

    constructor() {
        owner = msg.sender;
    }

    function createIndex(
        string memory _name,
        string memory _symbol,
        address[] memory _composition,
        uint256[] memory _decimals,
        uint256[] memory _percentages,
        uint256 _managerFee
    ) public {
        address _nativeCurrency = nativeCurrenciesByChainId[block.chainid];
        if (_nativeCurrency == address(0)) {
            revert();
        }

        Index index = new Index(
            _name,
            _symbol,
            _composition,
            _decimals,
            _percentages,
            msg.sender,
            _managerFee,
            _nativeCurrency
        );
        emit LogDeployedIndexContract(address(index));
        indexes.push(address(index));
    }

    function setOwner(address _owner) public {
        require(msg.sender == owner);
        owner = _owner;
    }

    function setNativeCurrencyForChainId(
        address _nativeCurrency,
        uint256 _chainId
    ) public {
        require(msg.sender == owner);
        nativeCurrenciesByChainId[_chainId] = _nativeCurrency;
    }
}
