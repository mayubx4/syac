import React from 'react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import Withdraw from '../../components/Withdraw'
import NFTs from '../../components/NFTs'

const Staking = ({wallet}) => {
  return (
    <Layout>
      <Header wallet={wallet}/>
      <Withdraw wallet={wallet}/>
      <NFTs wallet={wallet}/>
    </Layout>
  )
}

export default Staking
