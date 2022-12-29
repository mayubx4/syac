import React, { useEffect, useState } from "react";
import Web3 from "web3";
import config from "../../config.json";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import getSignature from "../../util/signature";
import { getNFTs } from "../../util/utilities";

const Withdraw = ({ wallet, type }) => {
  const [reward, setReward] = useState("");
  const [loader, setLoader] = useState(false);
  const web3 = new Web3(window.ethereum);
  const stakingContract = new web3.eth.Contract(
    type === "syac" ? config.stakingAbi : config.stakingAbiOYAC,
    type === "syac" ? config.stakingContract : config.stakingContractOYAC
  );
  const nftContract = new web3.eth.Contract(
    type === "syac" ? config.nftAbi : config.nftAbiOYAC,
    type === "syac" ? config.nftContract : config.nftContractOYAC
  );

  const getReward = async () => {
    let rewards;
    if (type === "syac")
      rewards = await stakingContract.methods.rewardOfUser(wallet).call();
    else {
      rewards = await axios.get(config.apiUrl + wallet);
      rewards = rewards.data.result.totalRewards.toString();
    }
    console.log("rewards", rewards);
    return rewards;
  };
  useEffect(() => {
    async function fetchReward() {
      const rewards = await getReward();
      console.log(rewards, "ssssssssssssss");
      setReward(rewards);
    }
    fetchReward();
  }, []);

  const WithdrawReward = async () => {
    setLoader(true);
    if (type === "syac")
      await stakingContract.methods.WithdrawReward().send({ from: wallet });
    else {
      console.log(web3.utils.toWei(reward));
      const data = await getSignature(wallet);
      await stakingContract.methods
        .WithdrawReward(web3.utils.toWei(reward), +data.nonce, data.signature)
        .send({ from: wallet });
      const data1 = await getNFTs(nftContract, stakingContract, wallet, type);
      if (data1.stakedNfts.length === 0)
        await axios.delete(config.apiUrl + wallet);
      else {
        await axios.patch(config.apiUrl + "updateReward/" + wallet);
      }
    }
    setReward(0);
    setLoader(false);
  };
  return (
    <div className='relative z-30 flex flex-col items-center py-10'>
      <p className='text-2xl font-bold text-white text-center '>
        {type === "syac" ? web3.utils.fromWei(reward) : reward ? reward : 0}
      </p>
      <p className='text-2xl text-white text-center'>Collected AMC</p>
      <button
        onClick={WithdrawReward}
        className='text-base text-white font-bold rounded-[99px] w-[137px] bg-[#FF0000]
      py-2 mt-8 hover:bg-opacity-75 flex justify-center
      disabled:bg-slate-900 disabled:cursor-not-allowed'
        disabled={reward == 0}
      >
        {loader ? <CgSpinner className='animate-spin w-6 h-6 mx-1' /> : ""}
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;
