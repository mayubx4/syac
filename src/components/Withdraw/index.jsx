import React, { useEffect, useState } from "react";
import Web3 from "web3";
import config from "../../config.json";
import { CgSpinner } from "react-icons/cg";

const Withdraw = ({ wallet }) => {
  const [reward, setReward] = useState("");
  const [loader, setLoader] = useState(false);
  const web3 = new Web3(window.ethereum);
  const stakingContract = new web3.eth.Contract(
    config.stakingAbi,
    config.stakingContract
  );
  const getReward = async () => {
    const result = await stakingContract.methods.rewardOfUser(wallet).call();
    console.log(result);
    setReward(result);
  };
  useEffect(() => {
    async function fetchReward() {
      await getReward();
    }
    fetchReward();
  }, []);

  const WithdrawReward = async () => {
    setLoader(true);
    await stakingContract.methods.WithdrawReward().send({ from: wallet });
    await getReward();
    setLoader(false);
  };
  return (
    <div className='relative z-30 flex flex-col items-center py-10'>
      <p className='text-2xl font-bold text-white text-center '>
        {web3.utils.fromWei(reward)}
      </p>
      <p className='text-2xl text-white text-center'>Collected AMC</p>
      <button
        onClick={WithdrawReward}
        className='text-base text-white font-bold rounded-[99px] w-[137px] bg-[#FF0000]
      py-2 mt-8 hover:bg-opacity-75 flex justify-center'
      >
        {loader ? <CgSpinner className='animate-spin w-6 h-6 mx-1' /> : ""}
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;
