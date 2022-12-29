import React from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

const ConnectBtn = ({ redirect, setWallet, setIsMsgVerified }) => {
  const web3 = new Web3(window.ethereum);
  const message = "Sign to Stake SYAC NFT";
  const nevigate = useNavigate();
  const getAccount = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      return account;
    } catch (e) {
      console.log(e.message);
    }
  };

  async function verifyMessage(wallet, sign) {
    try {
      const from = wallet;
      const recoveredAddr = await web3.eth.personal.ecRecover(message, sign);
      console.log("recoveredAddr : " + recoveredAddr);
      if (recoveredAddr.toLowerCase() === from.toLowerCase()) {
        console.log(`Successfully ecRecovered signer as ${recoveredAddr}`);
        return true;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        );
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }
  const login = async wallet => {
    try {
      const from = wallet;
      console.log("from : " + from);
      const sign = await web3.eth.personal.sign(message, from);
      console.log("sign : " + sign);
      return sign;
    } catch (err) {
      console.error(err);
    }
  };

  const connect = async () => {
    try {
      let isMsgVerified = false;
      let isConnected = false;
      if (window.ethereum) {
        console.log("Metamask connected");
        isConnected = true;
        await window.ethereum.enable();
        const account = await getAccount();
        localStorage.setItem("wallet", account);
        setWallet(account);
        const sign = await login(account);
        isMsgVerified = await verifyMessage(account, sign);
        sessionStorage.setItem("isMsgVerified", isMsgVerified);
        setIsMsgVerified(isMsgVerified);
      } else {
        console.log("Metamask not installed");
        isConnected = false;
      }
      if (isConnected && redirect && isMsgVerified) nevigate("/staking");
    } catch (error) {
      console.log("error while connecting metamask", error);
      return false;
    }
  };
  return (
    <button
      onClick={async () => (setWallet ? await connect() : "")}
      className='w-[281px] py-5 text-2xl font-bold text-center text-white bg-[#256FFF] 
                    rounded-[99px]  hover:bg-opacity-75 focus:outline'
    >
      Connect Wallet
    </button>
  );
};

export default ConnectBtn;
