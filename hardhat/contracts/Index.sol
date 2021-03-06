//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/// @dev Bump version when changing this contract
contract Index is ERC20Upgradeable {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    // Uniswap V3 addressses are the same on all networks
    ISwapRouter public constant ROUTER =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    /// @dev Index properties
    /// name is handled by ERC20Upgradeable openzeppelin contract
    /// symbol is handled by ERC20Upgradeable openzeppelin contract
    address[] public composition;
    uint256[] public percentages;
    uint24[] public poolFees;
    address payable public managerAddress;
    uint256 public managerFee;
    uint256 public protocolFee;
    address payable public protocolAddress = payable(address(0));
    address public networkCurrency;
    uint256 public protocolVersion = 1;

    // Index vault (investor => token => amount)
    mapping(address => mapping(address => uint256)) public vault;
    mapping(address => uint256) public totalsInVault;

    uint256 public managerBalance = 0;

    // Events
    event Invested(
        address investor,
        uint256 amount,
        uint256[] amountsSwapped,
        uint256[] newTotalsInVault
    );
    event Redeemed(
        address investor,
        uint256 amount,
        uint256[] newTotalsInVault
    );

    constructor(
        string memory _name,
        string memory _symbol,
        address[] memory _composition,
        uint256[] memory _percentages,
        uint24[] memory _poolFees,
        uint256 _managerFee,
        address _nativeCurrency,
        uint256 _protocolFee,
        address _protocolAddress,
        address _manager
    ) initializer ERC20Upgradeable() {
        __ERC20_init(_name, _symbol);
        composition = _composition;
        // percentages should use basis points
        percentages = _percentages;
        poolFees = _poolFees;
        managerFee = _managerFee;
        networkCurrency = _nativeCurrency;
        managerAddress = payable(_manager);
        protocolFee = _protocolFee;
        protocolAddress = payable(_protocolAddress);
        // validate lengths
        require(
            _composition.length == _percentages.length &&
                _composition.length == _poolFees.length,
            "composition, decimals, percentages, and poolFees must be the same length"
        );

        // validate that all percentages add up to 10000 basis points
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            totalPercentage = totalPercentage + _percentages[i];
        }
        require(
            totalPercentage == 10000,
            "percentages must add up to 10000 basis points"
        );
    }

    function calculateTotalsInVaultList()
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](composition.length);
        for (uint256 i = 0; i < composition.length; i++) {
            result[i] = totalsInVault[composition[i]];
        }
        return result;
    }

    function buy() public payable {
        //divide the amount by the total percentage in basis points
        require(msg.value > 0, "must send funds to buy");

        // calculate fees
        uint256 _total = 0;
        uint256[] memory _amounts = new uint256[](composition.length);
        uint256[] memory _amountsSwapped = new uint256[](composition.length);
        uint256 _feeForManager = (msg.value * managerFee) / 10000;
        uint256 _feeForProtocol = (msg.value * managerFee) / 10000;
        uint256 _valueAfterFees = msg.value - _feeForManager - _feeForProtocol;

        // calculate amounts of ETH to swap
        for (uint256 i = 0; i < composition.length; i++) {
            require(
                (_valueAfterFees / 10000) * 10000 == _valueAfterFees,
                "funds sent is too small to calculate amounts"
            );
            uint256 _amountToBuy = (_valueAfterFees * percentages[i]) / 10000;
            _amounts[i] = _amountToBuy;
            _total = _total + _amountToBuy;
        }

        // swap ETH for tokens
        for (uint256 i = 0; i < composition.length; i++) {
            uint256 _amountToBuy = _amounts[i];
            require(_amountToBuy > 0, "amount to buy must be greater than 0");
            // swap ETH for token
            uint256 amountSwapped = swapExactETHForToken(
                _amountToBuy,
                composition[i],
                poolFees[i] // to match the proper pool from where to get the liquidity
            );
            // add to vault
            vault[msg.sender][composition[i]] =
                vault[msg.sender][composition[i]] +
                amountSwapped;

            _amountsSwapped[i] = amountSwapped;
            totalsInVault[composition[i]] =
                totalsInVault[composition[i]] +
                amountSwapped;
        }

        // fractional reminder goes to protocol balance
        uint256 _reminder = _total - _valueAfterFees;
        protocolAddress.transfer(_feeForProtocol + _reminder);

        // send ETH to manager
        managerBalance = managerBalance + _feeForManager;

        // send token to investor
        _mint(msg.sender, _total);

        // emit event
        emit Invested(
            msg.sender,
            _total,
            _amountsSwapped,
            calculateTotalsInVaultList()
        );
    }

    function redeem(uint256 amount) external {
        require(amount > 0, "amount must be greater than 0");
        require(
            amount <= balanceOf(msg.sender),
            "amount must be less than or equal to balance"
        );
        uint256 initialAmountTokens = balanceOf(msg.sender);
        uint256 amountRedeemedTokens = amount;

        // redeem everything that belongs to him in the vault and burn its tokens
        for (uint256 i = 0; i < composition.length; i++) {
            uint256 _newAmountInVault = (initialAmountTokens *
                vault[msg.sender][composition[i]] -
                amountRedeemedTokens *
                vault[msg.sender][composition[i]]) / initialAmountTokens;
            uint256 _amountSubstracted = vault[msg.sender][composition[i]] -
                _newAmountInVault;
            ERC20Upgradeable(composition[i]).safeTransfer(
                msg.sender,
                _amountSubstracted
            );

            totalsInVault[composition[i]] =
                totalsInVault[composition[i]] -
                _amountSubstracted;

            vault[msg.sender][composition[i]] = _newAmountInVault;
        }
        _burn(msg.sender, amount);
        // emit event
        emit Redeemed(
            msg.sender,
            balanceOf(msg.sender),
            calculateTotalsInVaultList()
        );
    }

    function withdrawFees() external payable {
        require(
            msg.sender == managerAddress,
            "must be manager to withdraw fees"
        );

        managerAddress.transfer(managerBalance);
        managerBalance = 0;
    }

    function swapExactETHForToken(
        uint256 _amountIn,
        address _tokenOut,
        uint24 _fee
    ) private returns (uint256 amountOut) {
        require(_amountIn > 0, "Must pass non 0 ETH amount");
        require(_fee > 0, "Must pass non 0 fee amount");

        // using 'now' for convenience, for mainnet pass deadline from frontend!
        uint256 deadline = block.timestamp + 15;

        address tokenIn = networkCurrency;
        address recipient = address(this);

        // tweak this values for mainnet launch
        uint160 sqrtPriceLimitX96 = 0;
        uint160 amountOutMinimum = 0;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams(
                tokenIn,
                _tokenOut,
                _fee,
                recipient,
                deadline,
                _amountIn,
                amountOutMinimum,
                sqrtPriceLimitX96
            );
        // should return reminder of eth? in this case it does not matter
        // since all eth sent is used
        return ROUTER.exactInputSingle{value: _amountIn}(params);
    }

    function _transferVaults(
        address owner,
        address newOwner,
        uint256 initialAmountTokens,
        uint256 amountTransferredTokens
    ) private {
        for (uint256 i = 0; i < composition.length; i++) {
            // calculate amount to transfer inside the vault
            uint256 _newAmountInVault = (initialAmountTokens *
                vault[msg.sender][composition[i]] -
                amountTransferredTokens *
                vault[msg.sender][composition[i]]) / initialAmountTokens;
            uint256 _amountSubstracted = vault[msg.sender][composition[i]] -
                _newAmountInVault;

            require(
                _amountSubstracted > 0,
                "amount to transfer within vault are too small"
            );
            // update new owner vault
            vault[newOwner][composition[i]] =
                vault[newOwner][composition[i]] +
                _amountSubstracted;
            // update old owner vault
            vault[owner][composition[i]] =
                vault[owner][composition[i]] -
                _amountSubstracted;
        }
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        address owner = _msgSender();
        uint256 initialAmount = balanceOf(owner);
        _transfer(owner, to, amount);
        _transferVaults(owner, to, initialAmount, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 initialAmount = balanceOf(from);
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        _transferVaults(from, to, initialAmount, amount);

        return true;
    }
}
