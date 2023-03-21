import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  makeBetinCasino,
  casinoContract,
} from "./util/interact.js";

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
      
      casinoContract.events.NewBet({}, (error, data) => {
      

        if (data.returnValues[0] === true) {
          setPreviousBet('even');
          } else {
            setPreviousBet('odd');
          }

      setRandomNumber(data.returnValues[2]);
      
      if (data.returnValues[3] === true)  {
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
        <div id='roulette-panel'>
        <div className="image-container">
          <img src="https://img.icons8.com/external-smashingstocks-detailed-outline-smashing-stocks/100/ffebcd/external-spinning-industrial-production-factory-automation-smashingstocks-detailed-outline-smashing-stocks.png" alt="Spinning Roulette" />
        </div>
      <h1>Ethereum Roulette App</h1>
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
            setPreviousBet('even');
          }}>
              Make a bet on <br></br> even numbers
          </button>
          <button id="oddNumbersBetButton" onClick={() => {
            oddNumbersBetButtonClick();
            setBet(false);
            setDisplayedBet('odd');
            setPreviousBet('even');
          }}>
            Make a bet on <br></br> odd numbers
          </button>
        <div>
            <p>{betIsMade && gamblerName && !betIsSent ? gamblerName + ' is placing the bet on ' + displayedBet + ' numbers' : '' }</p>
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
      <div id='rules-panel'>
        <h1 id='rules-panel-headline'>Roulette Rules</h1>
        <ul>
          <li>The roulette produces a semi-random number in a range of 0 to 9.</li>
          <li>You can bet on even numbers: 2,4,.. or on odd numbers: 1,3,..</li>
          <li>It is not possible to place a bet on 0.</li>
          <li>The bet amount is set to 0.01 Goerli Ether and cannot be changed.</li>
          <li>If you guess the numbers correctly, you will win double your bet amount.</li>
          <li>It can take up to one minute before the new block is mined and the result is obtained.</li>
        </ul>
      </div>
    </div>
  );
};

export default Roulette;
