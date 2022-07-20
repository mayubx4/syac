import { ethers } from "ethers";
import config from "../config.json";

const getSignature = async (user) => {
  const contract = config.stakingContractOYAC; //withdrawcontract
  // user = "0x12E8613F1d980FD0543ECEBB2dab9533C589250F"; //user_address

  const RPC = "https://api.avax-test.network/ext/bc/C/rpc";
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const blockNumber = await provider.getBlockNumber();

  const nonce = (await provider.getBlock(blockNumber)).timestamp;
  console.log("nonce-timestamp:", nonce);

  let hash = ethers.utils.solidityKeccak256(
    ["string", "string", "uint256"],
    [contract.toLowerCase(), user.toLowerCase(), nonce]
  );
  console.log("hash:", hash);

  let privateKey =
    "0xf64dad5cebb06fdb1d7560487da5ae5b0c144b15ba6f28f587af713c7e81c35d"; //signer_pk
  // 0x7D3A326D974496111Bdd18f0c1bC60b3Be865862 - signer address

  const signingKey = new ethers.utils.SigningKey(privateKey);
  let deployTx = signingKey.signDigest(hash);

  const signature = ethers.utils.joinSignature(deployTx);
  console.log("Signature:", signature);
  return { hash, nonce, signature };
};

export default getSignature;
