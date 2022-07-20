const getNFTs = async (nftContract, stakingContract, wallet, type,Moralis) => {
    let stakedNfts = await stakingContract.methods.userStakedNFT(wallet).call();
    stakedNfts = stakedNfts.map(nft => {
        return Number(nft);
    });
    let stakedNftsLocked =
        type === "syac"
            ? []
            : await stakingContract.methods.LockeduserNFT_s(wallet).call();
    stakedNftsLocked = stakedNftsLocked.map(nft => {
        return Number(nft);
    });
    console.log("stakedNftsLocked", stakedNftsLocked);
    let totalNfts = [];
    let isLocked = null;
    let lckdReward = 0;
    if (type === "syac") {
        const NFTs = await Moralis.Web3API.account.getNFTs({
            chain: "eth",
            address: wallet,
        });
        NFTs.result.forEach(nft => {
            if (nft.symbol === "SYAC") totalNfts.push(Number(nft.token_id));
        });
    } else {
        totalNfts = await nftContract.methods.walletOfOwner(wallet).call();
        isLocked = await stakingContract.methods.isLockedStaked(wallet).call();
        console.log("isLocked", isLocked);
        lckdReward = await stakingContract.methods
            .lockedtotalReward(wallet)
            .call();
    }
    const unStakedNfts = totalNfts.filter(nftId => {
        return !stakedNfts.includes(nftId) && !stakedNftsLocked.includes(nftId);
    });
    console.log("unStakedNfts", unStakedNfts);
    console.log("totalNfts", totalNfts);
    return {
        stakedNfts,
        unStakedNfts,
        stakedNftsLocked,
        totalNfts,
        isLocked,
        lckdReward,
    };
};

export {
    getNFTs
}