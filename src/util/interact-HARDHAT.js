// VERSION OF INTERACT.JS WHEN RUNNING LOCAL HARDHAT NODE

const { ethers } = require("ethers");
require('dotenv').config();

// 0x5FbDB2315678afecb367f032d93F642f64180aa3 = address of the 
// first smart contract deployed on newly initiated Local Hardhat node
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Use MetaMask wallet as the provider
const provider = new ethers.providers.Web3Provider(window.ethereum);


const providerRPC = new ethers.providers.JsonRpcProvider();
const contractABI = require("../contract-abi.json");
export const contractListener = new ethers.Contract(contractAddress, contractABI, providerRPC);


let callData;
export const makeBetinCasino = async (address, bet, gamblerName, betIsMade) => {

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

  if (window.ethereum) {
    try {
      // Prepare the data param for the transaction
      await provider.send("eth_requestAccounts", []);
      let ABI = ["function makeBet(bool _betIsEven)"];
      let iface = new ethers.utils.Interface(ABI);
      callData =  iface.encodeFunctionData("makeBet", [bet]);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error('Metamask not found');
  }


  // input error handling
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
    data: callData,
    //value: '0x2386F26FC10000' // 0.01 ether => 10000000000000000 wei => '2386F26FC10000'
    value: '0x8AC7230489E80000' // hardcoded
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters]
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a rel="noopener" href={`https://goerli.etherscan.io/tx/${txHash}`}>
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
          status: "Insert your name in the text-field below.",
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
              <a rel="noopener" href={`https://metamask.io/download`}>
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
          status: "Insert your name in the text-field below",
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
            <a rel="noopener" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

