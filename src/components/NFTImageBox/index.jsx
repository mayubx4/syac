import React from "react";
import config from "../../config.json";

const NFTImageBox = ({ nftId, option, onChangeCheckbox }) => {
  const pad = n => {
    var s = "000" + n;
    return s.substring(s.length - 4);
  };
  return (
    <div className='relative'>
      <img
        src={config.nftUrl + pad(nftId) + ".png"}
        alt='nft'
        className={`h-[146px] rounded-[14px] mt-5 `}
        width={146}
        height={146}
      />
      <p className='text-center text-white'>{nftId}</p>
      {option === 2 || option === 3 ? (
        <input
          id={nftId}
          type='checkbox'
          onChange={e => onChangeCheckbox(e, nftId)}
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

export default NFTImageBox;
