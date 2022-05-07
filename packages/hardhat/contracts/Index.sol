//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

contract Index is ERC20 {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    // Uniswap V3 addressses are the same on all networks
    IUniswapRouter public constant ROUTER =
        IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoter public constant QUOTER =
        IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);

    /// @dev Index properties
    /// name is handled by ERC20 openzeppelin contract
    /// symbol is handled by ERC20 openzeppelin contract
    address[] public composition;
    uint256[] public tokenDecimals;
    uint256[] public percentages;
    address public manager;
    uint256 public managerFee;
    address public networkCurrency;

    // Index vault
    mapping(address => mapping(address => uint256)) public vault;

    constructor(
        string memory _name,
        string memory _symbol,
        address[] memory _composition,
        uint256[] memory _tokenDecimals,
        uint256[] memory _percentages,
        address _manager,
        uint256 _managerFee,
        address _networkCurrency
    ) ERC20(_name, _symbol) {
        composition = _composition;
        tokenDecimals = _tokenDecimals;
        percentages = _percentages;
        manager = _manager;
        managerFee = _managerFee;
        networkCurrency = _networkCurrency;

        // validate composition
        // validate that all tokens are unique
        // validate that all addresses are ERC20
        // validate that all decimals are positive
        // validate that all percentages are positive
        // validate that all percentages add up to 100
        // validate that all the lists are the same length
    }
}
