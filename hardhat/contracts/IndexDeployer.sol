//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Index.sol";

contract IndexDeployer {
    address protocolAddress;
    address[] public indexes;
    uint256 public indexContractVersion = 0;
    uint256 protocolFee = 100; // default 1%

    event LogDeployedIndexContract(address child);

    mapping(uint256 => address) nativeCurrenciesByChainId;

    Index public IndexContract = Index(address(0));

    constructor(address _indexContractAddress) {
        // msg sender here is the protocol address
        protocolAddress = msg.sender;
        setNewContractVersion(_indexContractAddress);
    }

    function createIndex(
        string memory _name,
        string memory _symbol,
        address[] memory _composition,
        uint256[] memory _percentages,
        uint24[] memory _poolFees,
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
            _percentages,
            _poolFees,
            _managerFee,
            _nativeCurrency,
            protocolFee,
            protocolAddress,
            msg.sender
        );
        emit LogDeployedIndexContract(address(index));
        indexes.push(address(index));
    }

    function setProtocolAddress(address _protocolAddress) public {
        require(msg.sender == protocolAddress);
        protocolAddress = _protocolAddress;
    }

    function setNewContractVersion(address _newVersion) public {
        require(msg.sender == protocolAddress);
        IndexContract = Index(_newVersion);
        indexContractVersion = indexContractVersion + 1;
    }

    function setNativeCurrencyForChainId(
        address _nativeCurrency,
        uint256 _chainId
    ) public {
        require(msg.sender == protocolAddress);
        nativeCurrenciesByChainId[_chainId] = _nativeCurrency;
    }
}
