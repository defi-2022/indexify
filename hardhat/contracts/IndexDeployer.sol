//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Index.sol";

// Initializable is already imported throuh ERC20Upgradeable on Index.sol
contract IndexDeployer is Initializable {
    // Restrictions and Caveats on how to upgrade this contract: https://docs.openzeppelin.com/learn/upgrading-smart-contracts
    address public protocolAddress;
    address[] public indexes;
    uint256 public indexContractVersion;
    uint256 public protocolFee;

    event LogDeployedIndexContract(
        address child,
        string _name,
        string _symbol,
        address[] _composition,
        uint256[] _percentages,
        uint24[] _poolFees,
        uint256 _managerFee,
        address _nativeCurrency,
        uint256 _protocolFee,
        address _protocolAddress,
        address _manager
    );

    address public nativeCurrency;

    function initialize(address _protocolAddress) public initializer {
        protocolAddress = _protocolAddress;
        protocolFee = 100; // 1%
        setNewContractVersion();
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function createIndex(
        string memory _name,
        string memory _symbol,
        address[] memory _composition,
        uint256[] memory _percentages,
        uint24[] memory _poolFees,
        uint256 _managerFee
    ) public returns (address) {
        if (nativeCurrency == address(0)) {
            revert("nativeCurrency is not set v1");
        }

        Index index = new Index(
            _name,
            _symbol,
            _composition,
            _percentages,
            _poolFees,
            _managerFee,
            nativeCurrency,
            protocolFee,
            protocolAddress,
            msg.sender
        );
        emit LogDeployedIndexContract(
            address(index),
            _name,
            _symbol,
            _composition,
            _percentages,
            _poolFees,
            _managerFee,
            nativeCurrency,
            protocolFee,
            protocolAddress,
            msg.sender
        );
        indexes.push(address(index));
        return (address(index));
    }

    function setProtocolAddress(address _protocolAddress) public {
        require(msg.sender == protocolAddress);
        protocolAddress = _protocolAddress;
    }

    function setNewContractVersion() public {
        require(msg.sender == protocolAddress);
        indexContractVersion = indexContractVersion + 1;
    }

    function setNativeCurrency(address _nativeCurrency) public {
        require(msg.sender == protocolAddress);
        nativeCurrency = _nativeCurrency;
    }

    function setProtocolFee(uint256 _protocolFee) public {
        require(msg.sender == protocolAddress);
        protocolFee = _protocolFee;
    }

    function getIndexesLength() public view returns (uint256) {
        return indexes.length;
    }
}
