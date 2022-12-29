// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "Z9gl-ieaRIGjVZSowqtwA9AoxLi3Nvd-", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Print owner's wallet address:
const ownerAddr = "0xf916b5302B5E06FEC2925c914Eb86549899fc877";
console.log("fetching NFTs for address:", ownerAddr);
console.log("...");

// Print total NFT count returned in the response:
const getNFTss = async (wallet, pageKey = "") => {
  let nftsForOwner = await alchemy.nft.getNftsForOwner(wallet, { pageKey });
  console.log(nftsForOwner.ownedNfts, 2);
  while (nftsForOwner.pageKey) {
    const rsp = await getNFTss(wallet, nftsForOwner.pageKey);
    nftsForOwner.pageKey = rsp.pageKey;
    nftsForOwner.ownedNfts = nftsForOwner.ownedNfts.concat(rsp.ownedNfts);
  }

  console.log(
    "number of NFTs found:",
    nftsForOwner.totalCount,
    nftsForOwner.ownedNfts,
    4
  );
  return nftsForOwner;
};
// console.log("===");

// // Fetch metadata for a particular NFT:
// console.log("fetching metadata for a Crypto Coven NFT...");
// const response = await alchemy.nft.getNftMetadata(
//   "0x5180db8F5c931aaE63c74266b211F580155ecac8",
//   "1590"
// );

// // Uncomment this line to see the full api response:
// // console.log(response);

// // Print some commonly used fields:
// console.log("NFT name: ", response.title);
// console.log("token type: ", response.tokenType);
// console.log("tokenUri: ", response.tokenUri.gateway);
// console.log("image url: ", response.rawMetadata.image);
// console.log("time last updated: ", response.timeLastUpdated);
// console.log("===");

export { getNFTss };
