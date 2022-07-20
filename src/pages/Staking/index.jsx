import React from "react";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Withdraw from "../../components/Withdraw";
import NFTs from "../../components/NFTs";

const Staking = ({ wallet }) => {
  return (
    <Layout>
      <Header wallet={wallet} />
      <div className='flex'>
        <div className='w-1/2 pr-[104px]'>
          <Withdraw wallet={wallet} type='syac' />
        </div>
        <div className='w-1/2 pl-[104px]'>
          <Withdraw wallet={wallet} type='oyac' />
        </div>
      </div>
      <div className='flex'>
        <NFTs wallet={wallet} type='syac' />
        <div className='h-[650px] w-[1px] bg-[#21406F] mx-[104px] relative z-30' />
        <NFTs wallet={wallet} type='oyac' />
      </div>
    </Layout>
  );
};

export default Staking;
