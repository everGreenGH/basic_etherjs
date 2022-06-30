const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const myAddress = "0x3338f7c7a0ABAC5C20e8d2ACa03E8C25fe31304F"; // 송신자
const yourAddress = "0x1310B7F36cEd9Fa73a04fD150CC08f11AcA5dfCb"; // 수신자

const address = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1"; // New Penguin Token Contract
const ERC20_ABI = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
];

const contract = new ethers.Contract(address, ERC20_ABI, provider);
const wallet = new ethers.Wallet(privateKey, provider);

const main = async () => {

    const myBalanceBefore = await contract.balanceOf(myAddress);
    const yourBalanceBefore = await contract.balanceOf(yourAddress);
    console.log(`Sender's balance before transaction : ${ethers.utils.formatEther(myBalanceBefore)}`);
    console.log(`Receiver's balance before transaction : ${ethers.utils.formatEther(yourBalanceBefore)}\n`);

    const signedContract = contract.connect(wallet);

    const tx = await signedContract.transfer(yourAddress, ethers.utils.parseEther("10000"));
    await tx.wait();
    console.log(tx);

    const myBalanceAfter = await contract.balanceOf(myAddress);
    const yourBalanceAfter = await contract.balanceOf(yourAddress);
    console.log(`\nSender's balance after transaction : ${ethers.utils.formatEther(myBalanceAfter)}`);
    console.log(`Receiver's balance after transaction : ${ethers.utils.formatEther(yourBalanceAfter)}`);
}

main()