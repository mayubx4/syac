import React from "react";
import logo from "../../assets/images/logo.png";

const Header = ({ wallet }) => {
  return (
    <div className='border-b pt-[54px] pb-[41px] relative z-30 border-[#21406F]'>
      <div className='max-w-[1580px] flex justify-between xxl:px-[100px]'>
        <div className='rounded-full bg-black mx-auto'>
          <img src={logo} alt='logo' width={100} height={100} />
        </div>
        <div className='flex items-center xxl:w-[544px] w-[420px] justify-between '>
          <a
            href='https://www.syac.io/#membership-p'
            className='text-white text-xl'
          >
            MEMBERSHIP
          </a>
          <a href='https://www.syac.io/#road-p' className='text-white text-xl'>
            ROADMAP
          </a>
          <a href='https://www.syac.io/#team-p' className='text-white text-xl'>
            TEAM
          </a>
          <a
            href='https://www.syac.io/'
            className='text-white text-xl font-bold'
          >
            STAKING
          </a>
        </div>
        <div className='flex items-center ml-auto'>
          {wallet ? (
            <button
              className='text-white border border-white rounded-[99px] px-[30px] py-[10px] 
                      text-2xl font-bold'
            >
              {wallet.substr(0, 8) + "..." + wallet.substr(wallet.length - 8)}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
