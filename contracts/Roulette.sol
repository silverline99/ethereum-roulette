// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// npm install @openzeppelin/contracts
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// Imports of Openzeppelin security contracts
import "@openzeppelin/contracts/access/Ownable.sol"; // allows usage onlyOwner modifier
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // alows usage nonReentrant modifier

/// Blockchain Roulette contract -- version D3
contract Casino is Ownable, ReentrancyGuard {
    /**
     * Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    event NewBet(
        bool betEmit,
        uint256 betAmountEmit,
        uint256 generatedNumberEmit,
        bool gameStatusEmit
    );

    // Using private visibility modifier to make the mapping accessible only from within a contract
    mapping(address => bool) private activeBets;

    // Restricted to the owner of the contract by using onlyOwner modifier
    function getBalanceContract() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    // Restricted to the owner of the contract by using onlyOwner modifier
    function withdraw(
        address payable _to,
        uint256 _amount
    ) public onlyOwner returns (bool) {
        require(_amount < address(this).balance);
        _to.transfer(address(this).balance);
        return true;
    }

    function makeBet(
        bool _betIsEven
    ) public payable nonReentrant returns (bool) {
        activeBets[msg.sender] = _betIsEven;
        uint256 randomNumber = generateRandomness();
        bool winLossStatus = evaluateBet(_betIsEven, randomNumber);
        if (winLossStatus == true) {
            payoutWinner(msg.value);
        }
        emit NewBet(_betIsEven, msg.value, randomNumber, winLossStatus);
        return true;
    }

    function generateRandomness() private view returns (uint256) {
        // Get the current block hash
        bytes32 blockHash = blockhash(block.number - 1);
        // Combine the block hash with the contract address
        bytes32 combinedHash = keccak256(
            abi.encodePacked(blockHash, address(this))
        );
        // Use modulo division by 10 to obtain a single digit number
        uint256 randomValue = (uint256(combinedHash) % 10);
        return randomValue;
    }

    function evaluateBet(
        bool _userBet,
        uint256 _rouletteNumber
    ) private pure returns (bool) {
        bool numberIsEven;
        bool payout;

        // Determine whether the generated number is odd or even
        if (_rouletteNumber % 2 == 0) {
            numberIsEven = true;
        } else {
            numberIsEven = false;
        }

        // Zero means that roulette operator is winning
        if (_rouletteNumber == 0) {
            payout == false;
            // Determine whether the bet was successful
        } else if (_userBet == true && numberIsEven == true) {
            payout = true;
        } else if (_userBet == false && numberIsEven == false) {
            payout = true;
        } else {
            payout = false;
        }
        return payout;
    }

    function payoutWinner(uint256 _payout) public payable returns (bool) {
        // Double the bet to get the amount to payout to the winner
        uint256 pricemoney = 2 * _payout;
        payable(msg.sender).transfer((pricemoney));
        return (true);
    }

    // Those two functions prevent errors when testing on Hardhat local node
    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
