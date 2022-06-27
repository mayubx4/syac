import React, { useState, useEffect } from "react";
import Web3 from "web3";
import config from "../../config.json";
import logo from "../../assets/images/logo.png";
import "./styles.css";
import { useMoralis } from "react-moralis";
import { CgSpinner } from "react-icons/cg";

const NFTs = ({ wallet }) => {
  const [option, setOption] = useState(1);
  const [nftsToDisplay, setNftsToDisplay] = useState();
  const [nfts, setNfts] = useState();
  const [stakedNfts, setStakedNfts] = useState();
  const [unStakedNfts, setUnstakedNfts] = useState();
  const [checkedList, setCheckedList] = useState([]);
  const [loader, setLoader] = useState(false);

  const { Moralis, isAuthenticated, authenticate } = useMoralis();
  const web3 = new Web3(window.ethereum);
  const nftContract = new web3.eth.Contract(config.nftAbi, config.nftContract);
  const stakingContract = new web3.eth.Contract(
    config.stakingAbi,
    config.stakingContract
  );
  const pad = n => {
    var s = "000" + n;
    return s.substring(s.length - 4);
  };
  const onChangeCheckbox = (e, id) => {
    let resultArray = [];
    if (e.target.checked) {
      //if checked (true), then add this id into checkedList
      resultArray = checkedList.filter(CheckedId => CheckedId !== id);
      resultArray.push(id);
    } //if not checked (false), then remove this id from checkedList
    else {
      resultArray = checkedList.filter(CheckedId => CheckedId !== id);
    }
    resultArray = resultArray.map(Number);
    console.log(resultArray);
    setCheckedList(resultArray);
  };

  const handleSelectOption = async option => {
    setOption(option);
    setCheckedList([]);
    option === 1
      ? setNftsToDisplay(nfts)
      : option === 2
      ? setNftsToDisplay(unStakedNfts)
      : setNftsToDisplay(stakedNfts);
  };
  const handleStake = async () => {
    setLoader(true);
    console.log(nftContract);

    const result = await nftContract.methods
      .isApprovedForAll(wallet, config.stakingContract)
      .call();
    console.log(result);
    // if not true then call both if false call only 2nd
    if (!result) {
      console.log(config.stakingContract, wallet);
      await nftContract.methods
        .setApprovalForAll(config.stakingContract, true)
        .send({ from: wallet });
    }

    console.log(stakingContract);
    await stakingContract.methods.Stake(checkedList).send({ from: wallet });
    await getNFTs();
  };
  const handleUnStake = async () => {
    setLoader(true);

    console.log(nftContract);

    const result = await nftContract.methods
      .isApprovedForAll(wallet, config.stakingContract)
      .call();
    console.log(result);
    if (!result) {
      console.log(config.stakingContract, wallet);
      await nftContract.methods
        .setApprovalForAll(config.stakingContract, true)
        .send({ from: wallet });
    }

    console.log(stakingContract);
    await stakingContract.methods.unstake(checkedList).send({ from: wallet });
    await getNFTs();
  };
  const getNFTs = async () => {
    setLoader(true);
    let stakedNfts = await stakingContract.methods.userStakedNFT(wallet).call();
    stakedNfts = stakedNfts.map(nft => {
      return { id: Number(nft), isChecked: 0 };
    });
    console.log("stakedNfts", stakedNfts);
    setStakedNfts(stakedNfts);
    const NFTs = await Moralis.Web3API.account.getNFTs({
      chain: "eth",
      address: wallet,
    });
    const totalNfts = [];
    NFTs.result.map(nft => {
      if (nft.symbol === 'SYAC')
        return totalNfts.push({
          uri: nft.token_uri,
          id: Number(nft.token_id),
          isChecked: 0,
        });
    });
    const unStakedNfts = totalNfts.filter((nft, i) => {
      return !stakedNfts.includes(nft.id);
    });
    console.log("unStakedNfts", unStakedNfts);
    setUnstakedNfts(unStakedNfts);
    console.log("totalNfts", totalNfts);
    setNfts(totalNfts);
    option === 1
      ? setNftsToDisplay(totalNfts)
      : option === 2
      ? setNftsToDisplay(unStakedNfts)
      : setNftsToDisplay(stakedNfts);
    setLoader(false);
  };
  useEffect(() => {
    async function login() {
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
    }

    async function fetchNFTs() {
      await getNFTs();
    }

    login().then(() => fetchNFTs());
  }, []);
  const func = (nft, i) => {
    return (
      <div className='relative' key={i}>
        <img
          src={config.nftUrl + pad(nft.id) + ".png"}
          alt='nft'
          className={`h-[146px] rounded-[14px] mt-5 `}
          width={146}
          height={146}
        />
        <p className='text-center text-white'>{nft.id}</p>
        {option !== 1 ? (
          <input
            id={nft.id}
            type='checkbox'
            onChange={e => onChangeCheckbox(e, nft.id)}
            className='absolute top-0 left-0 mt-7 ml-2 bg-no-repeat bg-center border-gray-900
            checked:bg-white checked:bg-[url("/src/assets/images/Checkmark.svg")]
              appearance-none border w-5 h-5 rounded-full cursor-pointer'
          />
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <div className='w-full relative z-30'>
      <div className='xxl:w-[686px] w-1/2 mx-auto'>
        <div className=' border-y flex items-center justify-around py-8 '>
          <img
            src={logo}
            alt='logo'
            className='h-[120px]'
            width={120}
            height={120}
          />
          <div className='flex flex-col'>
            <p className='text-2xl text-white font-bold'>
              Spoiled Young Ape Club
            </p>

            <div className='mt-5'>
              <button
                className={`text-base text-white font-bold rounded-[99px] w-[110px] py-2 mr-4 hover:bg-opacity-75 
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
                className={`text-base text-white font-bold rounded-[99px] w-[110px] py-2 mr-4  
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
                className={`text-base text-white font-bold rounded-[99px] w-[110px] py-2 mr-4  
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
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center mt-6'>
          <p className='text-white text-base font-medium  ml-5 flex'>
            {nftsToDisplay && nftsToDisplay.length ? (
              nftsToDisplay.length
            ) : loader ? (
              <CgSpinner className='animate-spin w-6 h-6 mx-1' />
            ) : (
              "0"
            )}{" "}
            {option === 3 ? "NFT Staked" : "NFT in wallet"}
          </p>
          {option === 2 ? (
            <button
              onClick={handleStake}
              className='text-base text-white font-bold rounded-[99px] w-[105px] bg-[#FF9900]
            py-2 hover:bg-opacity-75 flex justify-center'
            >
              {loader ? (
                <CgSpinner className='animate-spin w-6 h-6 mx-1' />
              ) : (
                ""
              )}
              Stake
            </button>
          ) : option === 3 ? (
            <button
              onClick={handleUnStake}
              className='text-base text-white font-bold rounded-[99px] w-[105px] bg-[#FF9900]
            py-2 hover:bg-opacity-75 flex justify-center'
            >
              {loader ? (
                <CgSpinner className='animate-spin w-6 h-6 mx-1' />
              ) : (
                ""
              )}
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
              nftsToDisplay.map((nft, i) => {
                return func(nft, i);
              })
            ) : loader ? (
              <CgSpinner className='animate-spin w-20 h-20 mx-auto mt-5 relative z-20' />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTs;
