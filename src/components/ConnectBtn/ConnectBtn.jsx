import React from "react";
import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";

const ConnectBtn = ({ redirect, wallet, setWallet }) => {
  const nevigate = useNavigate();
  const { authenticate, isAuthenticated } = useMoralis();
  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log(account);
      localStorage.setItem("wallet", account);
      return account;
    } catch (e) {
      console.log(e.message);
    }
  };

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({
        signingMessage: "Sign to Stake SYAC NFT",
      })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const connect = async () => {
    try {
      let isConnected = false;
      if (window.ethereum) {
        console.log("Metamask connected");
        isConnected = true;
        const account = await getAccount();
        await login();
        setWallet(account);
      } else if (window.web3) {
        console.log("Metamask connected");
        isConnected = true;
      } else {
        console.log("Metamask not installed");
        isConnected = false;
      }
      if (isConnected) {
        if (redirect) {
          nevigate("/staking");
          return;
        }
      }
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
