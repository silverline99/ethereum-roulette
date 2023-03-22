# Ethereum Blockchain-Powered Roulette

This web3 dapp project involves two common operations - calling smart contract functions with different arguments and displaying the outcome using a smart contract listener. In order to use this application, users are required to have a MetaMask wallet installed, with some initial funding of Goerli Test Ethers, as it processes the outgoing transactions.

# Gas Costs Efficiency

The aim was to make the dapp as gas-cost-efficient as possible. To achieve this, the function `makeBet()` passes only one boolean argument that identifies whether the bet was placed on even numbers, and it also returns only one boolean value indicating if the gambler is winning or not. In order to evaluate the bet, smart contract uses two helper functions. One of these is a pure function and the second is a view function, thus none of them is consuming any gas. Lastly, the payout for a prospective winner is made immediately and doesn't require any additional actions, which would consume additional gas fees.

# Security & Generating Randomness

Although the generated numbers are quite easily guessed, the project is located on the testnet, and Goerli Ethers are in a limited amount available for free, so there are no assumptions that contract balance will be drained. Additionally, the smart contract uses two OpenZeppelin contracts - Ownable and ReentrancyGuard - for the purpose of increasing security.

# Getting Started

First install dependencies by running `npm install`. This project uses Alchemy Web3 so you need to go to [Alchemy.com](www.alchemy.com) to obtain your Alchemy API key. Once you have generated your API key, create `.env` file in the root of the project and add the API key. Finally, you can start a local development server with `npm start`.
Open http://localhost:3000 with your browser and see the result.

# Webpack 5 Polyfills Issue

If you are using `create-react-app` version >= 5 you might face multiple issues with webpack 5. The issue is caused by the fact that the web3.js and ethers.js packages have certain dependencies, which are not present within the browser environment by webpack 5. The problem can be resolved by installing react-app-rewired and missing modules. Step by step instructions are described in this article: [Webpack 5 Polyfills Issue](https://web3auth.io/docs/troubleshooting/webpack-issues#react).

# Advantages of Having Own Local Node

Establishing your own local node for testing purposes can be helpful. The main advantage is that you don't have to pay any gas fees to the testnet network. Additionally, you don't have to deploy every iteration of the smart contract to the testnet and send some initial funding in Goerli ETH. You can also adjust the parameters of the blockchain according to your needs. However, it is not possible to establish a connection with Alchemy Web3, and you have to use the Ethers library.

# Hardhat Local Node Setting Up

First install Hardhat `npm install --save-dev hardhat`. Create hardhat project inside root directory `npx hardhat`. Start your local node `npx hardhat node`. Deploy the contract using deployment script in scripts folder `npx hardhat run --network localhost scripts/deploy.js`.
Open Hardhat console `npx hardhat console` in other terminal window and don't forget to connect the estabilished node by the console command `const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')`. You can check if everything works well `await provider.getBlockNumber()`. The returned value should be 0 because so far no transactions were made.

Next, replace the `Roulette-HARDHAT.js` and `INTERACT-HARDHAT.js` files with their counterparts `Roulette.js` and `interact.js`.

Lastly, don't forget to reset your MetaMask account otherwise a transaction will fail throwing a nonce related error. Open MetaMask -> click on the icon in the upper right corner -> Settings -> Advanced -> Reset Account.

# Learn more

To learn more about the components used to build the project you can visit:

- [React Documentation](https://react.dev/learn) - learn more about frontend of a web3 app.
- [MetaMask Documentation](https://metamask.io/) - learn more about implementation of a MetaMask wallet.
- [Solidity Documentation](https://docs.soliditylang.org/en/v0.8.17/) - learn more about smart contracts.
- [Alchemy Web3 Development platform](https://docs.alchemy.com/) - learn more the tools they provide for web3 developers.
- [Ethers Documentation](https://docs.ethers.org/v5/) - learn more about ways how to interact with the Ethereum Blockchain.
- [HardHat Documentation](https://hardhat.org/docs) - learn more about Ethereum development environment.

# License

The application is available as an open-source project and is licensed under the MIT license.
