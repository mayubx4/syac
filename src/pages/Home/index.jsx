import React from "react";
import logo from "../../assets/images/logo.png";
import ConnectBtn from "../../components/ConnectBtn/ConnectBtn";

const Home = ({ setWallet,setIsMsgVerified }) => {
  return (
    <div
      className="bg-[url('assets/images/Background.webp')] bg-no-repeat bg-center bg-cover
                  w-full py-[100px] max-h-[1080px] max-w-[1920px] mx-auto h-screen"
    >
      <div className='w-full flex items-center justify-between flex-col h-full'>
        <img
          src={logo}
          alt='logo'
          className='position-absolute cursor-pointer'
          width={212}
          height={212}
        />
        <h1 className='text-white text-[44px] text-center font-bold  '>
          Please select a wallet to connect
        </h1>
        <ConnectBtn redirect={true} setWallet={setWallet} setIsMsgVerified={setIsMsgVerified}/>
      </div>
    </div>
  );
};

export default Home;
