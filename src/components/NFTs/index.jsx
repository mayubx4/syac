import React, { useState, useEffect } from "react";
import Web3 from "web3";
import config from "../../config.json";
import syac from "../../assets/images/logo.png";
import oyac from "../../assets/images/oyac.png";
import "./styles.css";
import { CgSpinner } from "react-icons/cg";
import NFTImageBox from "../NFTImageBox";
import axios from "axios";
import { getNFTs } from "../../util/utilities";

const NFTs = ({ wallet, type }) => {
  const [option, setOption] = useState(1);
  const [nftsToDisplay, setNftsToDisplay] = useState();
  const [nfts, setNfts] = useState();
  const [stakedNfts, setStakedNfts] = useState();
  const [lockedstakedNfts, setLockedStakedNfts] = useState();
  const [unStakedNfts, setUnstakedNfts] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isLockedStaked, setIsLockedStaked] = useState(false);
  const [lockedReward, setLockedReward] = useState(0);
  const [reward, setReward] = useState(0);

  const web3 = new Web3(window.ethereum);
  const nftContract = new web3.eth.Contract(
    type === "syac" ? config.nftAbi : config.nftAbiOYAC,
    type === "syac" ? config.nftContract : config.nftContractOYAC
  );
  const contract =
    type === "syac" ? config.stakingContract : config.stakingContractOYAC;
  const stakingContract = new web3.eth.Contract(
    type === "syac" ? config.stakingAbi : config.stakingAbiOYAC,
    contract
  );

  const remainingLockedTime = () => {
    const date1 = new Date();
    const date2 = new Date("01-10-2023");
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffTime + " milliseconds");
    // console.log(diffDays + " days");
    return diffDays;
  };
  const withdrawLockedReward = async () => {
    await stakingContract.methods
      .locked_Withdraw_Unstake()
      .send({ from: wallet });
    setLoader(true);
    const data = await getNFTs(nftContract, stakingContract, wallet, type);
    setLoader(false);
    setStakedNfts(data.stakedNfts);
    setUnstakedNfts(data.unStakedNfts);
    setIsLockedStaked(data.isLocked);
    setLockedStakedNfts(data.stakedNftsLocked);
    setNfts(data.totalNfts);
    setLockedReward(data.lckdReward);
    handleSelectOption(1, data.unStakedNfts);
  };
  const onChangeCheckbox = (e, id) => {
    let resultArray = [];
    if (e.target.checked) {
      //if checked (true), then add this id into checkedList
      resultArray = checkedList.filter(CheckedId => CheckedId !== +id);
      resultArray.push(id);
    } //if not checked (false), then remove this id from checkedList
    else {
      resultArray = checkedList.filter(CheckedId => CheckedId !== +id);
    }
    resultArray = resultArray.map(Number);
    console.log(resultArray);
    setCheckedList(resultArray);
  };

  const handleSelectOption = async (option, nftArr) => {
    setOption(option);
    setCheckedList([]);
    if (nftArr) {
      setNftsToDisplay(nftArr);
      return;
    }
    option === 1
      ? setNftsToDisplay(nfts)
      : option === 2
      ? setNftsToDisplay(unStakedNfts)
      : option === 3
      ? setNftsToDisplay(stakedNfts)
      : setNftsToDisplay(lockedstakedNfts);
  };

  const handleStake = async () => {
    setLoader(true);
    const isStakingFirstTime = stakedNfts.length === 0 ? true : false;
    const result = await nftContract.methods
      .isApprovedForAll(wallet, contract)
      .call();
    console.log(result);
    // if not true then call both if false call only 2nd
    if (!result) {
      await nftContract.methods
        .setApprovalForAll(contract, true)
        .send({ from: wallet });
    }

    await stakingContract.methods.Stake(checkedList).send({ from: wallet });
    setLoader(true);
    const data = await getNFTs(nftContract, stakingContract, wallet, type);
    setLoader(false);
    setStakedNfts(data.stakedNfts);
    setUnstakedNfts(data.unStakedNfts);
    setIsLockedStaked(data.isLocked);
    setLockedStakedNfts(data.stakedNftsLocked);
    setNfts(data.totalNfts);
    setLockedReward(data.lckdReward);
    if (type === "oyac") {
      // const stakingContractSYAC = new web3.eth.Contract(
      //   config.stakingAbi,
      //   config.stakingContract
      // );
      const isGen1Staked = await stakingContract.methods
        .isStaked(wallet)
        .call();
      if (isStakingFirstTime && reward === 0)
        await axios.post(config.apiUrl, {
          walletAddress: wallet,
          totalStaked: data.stakedNfts.length,
          isGen1Staked,
        });
      else
        await axios.patch(config.apiUrl + "updateTotalStaked/" + wallet, {
          totalStaked: data.stakedNfts.length,
        });
    }
    handleSelectOption(1).then(() => {
      handleSelectOption(option, data.unStakedNfts);
    });
  };

  const handleUnStake = async () => {
    setLoader(true);
    console.log(nftContract);
    const result = await nftContract.methods
      .isApprovedForAll(wallet, contract)
      .call();
    console.log(result);
    if (!result) {
      console.log(contract, wallet);
      await nftContract.methods
        .setApprovalForAll(contract, true)
        .send({ from: wallet });
    }
    await stakingContract.methods.unstake(checkedList).send({ from: wallet });
    setLoader(true);
    const data = await getNFTs(nftContract, stakingContract, wallet, type);
    setLoader(false);
    setStakedNfts(data.stakedNfts);
    setUnstakedNfts(data.unStakedNfts);
    setIsLockedStaked(data.isLocked);
    setLockedStakedNfts(data.stakedNftsLocked);
    setNfts(data.totalNfts);
    setLockedReward(data.lckdReward);
    if (type === "oyac") {
      if (data.stakedNfts.length === 0 && reward === 0) {
        await axios.delete(config.apiUrl + wallet);
      } else {
        await axios.patch(config.apiUrl + "updateTotalStaked/" + wallet, {
          totalStaked: data.stakedNfts.length,
        });
      }
    }
    handleSelectOption(1).then(() => {
      handleSelectOption(option, data.stakedNfts);
    });
  };

  useEffect(() => {
    async function fetchNFTs() {
      setLoader(true);
      const data = await getNFTs(nftContract, stakingContract, wallet, type);
      setLoader(false);
      setStakedNfts(data.stakedNfts);
      setUnstakedNfts(data.unStakedNfts);
      setIsLockedStaked(data.isLocked);
      setLockedStakedNfts(data.stakedNftsLocked);
      setNfts(data.totalNfts);
      setLockedReward(data.lckdReward);
      handleSelectOption(1, data.unStakedNfts);
    }

    fetchNFTs();

    async function getReward() {
      const resp = await axios.get(config.apiUrl + wallet);
      const rewards = resp.data.result.totalRewards;
      console.log("rewards", rewards);
      if (rewards) setReward(rewards);
    }
    getReward();
  }, []);

  return (
    <div className='w-full relative z-30'>
      <div className='border-[#21406F] border-y flex items-center justify-around py-8 '>
        <img
          src={type === "syac" ? syac : oyac}
          alt='logo'
          className='h-[120px]'
          width={120}
          height={120}
        />
        <div className='flex flex-col'>
          <p className='text-2xl text-white font-bold'>
            {type === "syac" ? "Spoiled " : "Olympics "}
            Young Ape Club
          </p>

          <div className='mt-5'>
            <button
              className={`text-base text-white font-bold rounded-[99px] px-3 py-2 mr-4 hover:bg-opacity-75 
                ${
                  option === 1
                    ? "bg-[#256FFF] hover:bg-opacity-75"
                    : "border border-[#ffffff] hover:bg-[#256FFF] hover:bg-opacity-10"
                }`}
              onClick={() => handleSelectOption(1)}
            >
              Wallet
            </button>
            <button
              className={`text-base text-white font-bold rounded-[99px] px-3 py-2 mr-4  
                ${
                  option === 2
                    ? "bg-[#256FFF] hover:bg-opacity-75"
                    : "border border-[#ffffff] hover:bg-[#256FFF] hover:bg-opacity-10"
                }`}
              onClick={() => {
                handleSelectOption(1).then(() => {
                  handleSelectOption(2);
                });
              }}
            >
              Staking
            </button>
            <button
              className={`text-base text-white font-bold rounded-[99px] px-3 py-2 mr-4  
              ${
                option === 3
                  ? "bg-[#256FFF] hover:bg-opacity-75"
                  : "border border-[#ffffff] hover:bg-[#256FFF] hover:bg-opacity-10"
              }`}
              onClick={async () => {
                handleSelectOption(1).then(() => {
                  handleSelectOption(3);
                });
              }}
            >
              Unstake
            </button>
            {isLockedStaked ? (
              <button
                className={`text-base text-white font-bold rounded-[99px] px-3 py-2 mr-4  
              ${
                option === 4
                  ? "bg-[#256FFF] hover:bg-opacity-75 whitespace-nowrap"
                  : "border border-[#ffffff] hover:bg-[#256FFF] hover:bg-opacity-10 whitespace-nowrap"
              }`}
                onClick={async () => {
                  handleSelectOption(1).then(() => {
                    handleSelectOption(4);
                  });
                }}
              >
                Locked Staking
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center mt-6'>
        <div>
          <p className='text-white text-base font-medium  ml-5 flex'>
            {nftsToDisplay && nftsToDisplay.length ? (
              nftsToDisplay.length
            ) : loader ? (
              <CgSpinner className='animate-spin w-6 h-6 mx-1' />
            ) : (
              "0"
            )}{" "}
            {option === 3
              ? "NFT Staked"
              : option === 4
              ? "NFT in locked staking"
              : "NFT in wallet"}
          </p>
          {option === 4 ? (
            <>
              <p className='text-white text-base font-medium  ml-5 flex'>
                Total Locked AMCs: {web3.utils.fromWei(lockedReward)}
              </p>
              <p className='text-white text-base font-medium  ml-5 flex'>
                Time Remaining To be Unlocked: {remainingLockedTime()} Days
              </p>
            </>
          ) : (
            ""
          )}
        </div>
        {option === 4 ? (
          <div>
            <button
              onClick={withdrawLockedReward}
              className={`text-base text-white font-bold rounded-[99px] p-2 
              ${
                remainingLockedTime() === 0
                  ? "bg-[#FF0000] hover:bg-opacity-75"
                  : "bg-slate-900"
              } flex justify-center whitespace-nowrap `}
              // disabled={remainingLockedTime() === 0 ? false : true}
            >
              {loader ? (
                <CgSpinner className='animate-spin w-6 h-6 mx-1' />
              ) : (
                ""
              )}
              Withdraw & Unstake
            </button>
          </div>
        ) : (
          ""
        )}
        {option === 2 ? (
          <button
            onClick={handleStake}
            className='text-base text-white font-bold rounded-[99px] w-[105px] bg-[#FF9900]
            py-2 hover:bg-opacity-75 flex justify-center 
            disabled:bg-slate-900 disabled:cursor-not-allowed'
            disabled={checkedList.length ? false : true}
          >
            {loader ? <CgSpinner className='animate-spin w-6 h-6 mx-1' /> : ""}
            Stake
          </button>
        ) : option === 3 ? (
          <button
            onClick={handleUnStake}
            className='text-base text-white font-bold rounded-[99px] w-[105px] bg-[#FF9900]
            py-2 hover:bg-opacity-75 flex justify-center 
            disabled:bg-slate-900 disabled:cursor-not-allowed'
            disabled={checkedList.length ? false : true}
          >
            {loader ? <CgSpinner className='animate-spin w-6 h-6 mx-1' /> : ""}
            Unstake
          </button>
        ) : (
          ""
        )}
      </div>
      <div
        className='ml-5 mt-5  overflow-y-auto h-[355px] scrollbar
          scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-700 scrollbar-track-blue-300 
          dark:scrollbar-thumb-blue-100 dark:scrollbar-track-gray-700'
      >
        <div className='-mt-5 flex flex-wrap justify-between pr-3'>
          {nftsToDisplay && nftsToDisplay.length ? (
            nftsToDisplay.map((nftId, i) => {
              return (
                <NFTImageBox
                  nftId={nftId}
                  key={i}
                  option={option}
                  onChangeCheckbox={onChangeCheckbox}
                />
              );
            })
          ) : loader ? (
            <CgSpinner className='animate-spin w-20 h-20 mx-auto mt-5 relative z-20' />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTs;
