// VERSION OF INTERACT.JS WHEN RUNNING ON GOERLI TESTNET

// Imports for creating contract abstraction
// require('dotenv').config();
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const web3 = createAlchemyWeb3(alchemyKey);



// Contract abstraction creation
const contractABI = require("../contract-abi.json");
// Smart Contract address on Goerli testnet: 0x3b7645163a82397cEc6ec025E6D3d00ED120BeE1
const contractAddress = "0x3b7645163a82397cEc6ec025E6D3d00ED120BeE1";
export const casinoContract = new web3.eth.Contract(
  contractABI,
  contractAddress 
);


export const makeBetinCasino = async (address, betIsEven, gamblerName, betIsMade) => {

  if (gamblerName.trim() === "") {
    return {
      status: "❌ You have to enter your name first.",
      betSendStatus:false,
      betMadeStatus:false
    };
  }

  if (betIsMade === false) {
    return {
      status: "❌ You have to choose whether you bet on odd or even numbers.",
      betSendStatus:false,
      betMadeStatus:false
    };
  }

  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  // Set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: casinoContract.methods.makeBet(betIsEven).encodeABI(),
    // 0.01 ether => 10000000000000000 wei => '0x2386F26FC10000;'
    // 0.1 ether => 1000000000000000000 wei => '16345785D8A0000'
    value: '0x2386F26FC10000'
  };

  // Sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters]
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" rel="noreferrer" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
        </span>
      ),
      betSendStatus:true,
      betMadeStatus:true
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "Insert you name in the text-field below.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" rel="noreferrer" href={`https://metamask.io/download`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Insert you name in the text-field below",
        };
      } else {
        return {
          address: "",
          status: "Connect to Metamask 🦊 using the Connect Wallet button 👆🏽.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

