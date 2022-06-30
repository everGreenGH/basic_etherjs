const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const myAddress = "0x3338f7c7a0ABAC5C20e8d2ACa03E8C25fe31304F"; // 송신자
const yourAddress = "0x1310B7F36cEd9Fa73a04fD150CC08f11AcA5dfCb"; // 수신자

const wallet = new ethers.Wallet(privateKey, provider);

const main = async () => {

    const myBalanceBefore = await provider.getBalance(myAddress);
    const yourBalanceBefore = await provider.getBalance(yourAddress);
    console.log(`Sender's balance before transaction : ${ethers.utils.formatEther(myBalanceBefore)}`);
    console.log(`Receiver's balance before transaction : ${ethers.utils.formatEther(yourBalanceBefore)}\n`);

    const tx = await wallet.sendTransaction({ 
        to: Address, 
        value: ethers.utils.parseEther("0.025")
    });

    await tx.wait();
    console.log(tx);

    const myBalanceAfter = await provider.getBalance(myAddress);
    const yourBalanceAfter = await provider.getBalance(yourAddress);
    console.log(`\nSender's balance after transaction : ${ethers.utils.formatEther(myBalanceAfter)}`);
    console.log(`Receiver's balance after transaction : ${ethers.utils.formatEther(yourBalanceAfter)}`);
}

main()