import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  makeBetinCasino,
  contractListener
} from "./util/interact-HARDHAT.js";

import './styles.css';


const Roulette = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [gamblerName, setGamblerName] = useState("");
  const [previousBet, setPreviousBet] = useState("No connection to the network.");
  const [betIsSent, setBetIsSent] = useState(false);
  const [randomNumber, setRandomNumber] = useState("");
  const [result, setResult] = useState(false);
  const [displayedBet, setDisplayedBet] = useState('')

  // Experimental
  const [betIsMade, setBetIsMade] = useState(false);
  const [bet, setBet] = useState(true);


  const evenNumbersBetButtonClick = () => {
    if (gamblerName === '') {
      setBetIsMade(false);
      setStatus('❌ You have to enter your name first.');
      setRandomNumber('');
    } else {
      setStatus('');
      setBetIsMade(true);
      setBetIsSent(false);
      setRandomNumber('');
    }
  };

  const oddNumbersBetButtonClick = () => {
    if (gamblerName === '') {
      setBetIsMade(false);
      setStatus('❌ You have to enter your name first.');
      setRandomNumber('');
    } else {
      setStatus('');
      setBetIsMade(true);
      setBetIsSent(false);
      setRandomNumber('');
    }
  };


  useEffect(() => {
    async function fetchMessage() {
      contractListener.on("NewBet", (betIsEven, betAmountEmit, generatedNumberEmit,gameStatusEmit) => {

        if (betIsEven === true) {
          setPreviousBet('even');
          } else {
            setPreviousBet('odd');
          }

      setRandomNumber(generatedNumberEmit);
      
      if (gameStatusEmit === true) {
        setResult('You won :)');
      } else {
        setResult('You lost :(');
      }

      setBetIsMade(false)
      
      });
    }
    fetchMessage();
    addSmartContractListener();

    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address)
      setStatus(status); 
    }
    fetchWallet();
    addWalletListener(); 
  }, []);

  function addSmartContractListener() {
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Insert you name in the text-field below");
        } else {
          setWallet("");
          setStatus(" Connect to Metamask 🦊 using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a rel="noopener" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onSendPressed = async () => {
    const { status,betSendStatus, betMadeStatus} = await makeBetinCasino(walletAddress, bet, gamblerName, betIsMade);
    setStatus(status);
    setBetIsSent(betSendStatus);
    setBetIsMade(betMadeStatus);
  };

  //the UI of our component
  return (
    <div id="container">
        <div className="image-container">
          <img src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/100/ffebcd/external-spinning-industrial-production-factory-automation-smashingstocks-detailed-outline-smashing-stocks.png" alt="Spinning Roulette" />
        </div>
      <h1>Ethereum Roulette App <br></br>Hardhat Node</h1>
      {/* Wallet */} 
      <button id="walletButton" onClick={connectWalletPressed}>
          {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
      </button>      
      <div>
        <p id="status">{status}</p>
      </div>
      <div>
        {/* Input form*/}   
        <input
              type="text"
              placeholder="Your name"
              maxLength="11"
              onChange={(e) =>  {
                setGamblerName(e.target.value);
                setBetIsSent(false)
                setStatus('')
                setBetIsMade(false)}
              }
              value={gamblerName}
        />
        <div>
          <button id="evenNumbersBetButton" onClick={ () => {
            evenNumbersBetButtonClick();
            setBet(true);
            setDisplayedBet('even');
          }}>
              Make a bet on <br></br> even numbers
          </button>
          <button id="oddNumbersBetButton" onClick={() => {
            oddNumbersBetButtonClick();
            setBet(false);
            setDisplayedBet('odd');
          }}>
            Make a bet on <br></br> odd numbers
          </button>
        <div>
            <p>{betIsMade && gamblerName  ? gamblerName + ' is placing the bet on ' + displayedBet + ' numbers' : '' }</p>
        </div>
        <button id="sendBetButton" onClick={onSendPressed}>
            Spin the wheel
          </button>
        </div>
        <div>
          <h3>{betIsSent && gamblerName ? gamblerName + ' placed the bet on ' + previousBet + ' numbers':''}</h3>
          <h3 id='waitingForTransaction'> {betIsSent && gamblerName && betIsMade ? 'Waiting for transaction to be finalized...':''}</h3>
          <h3>{betIsSent && randomNumber ? 'Winning number on roulette was: ' + randomNumber : ''}</h3>
          <h3>{betIsSent && randomNumber ? result : ''}</h3>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
