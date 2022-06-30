const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const address = "0x3338f7c7a0ABAC5C20e8d2ACa03E8C25fe31304F";

const main = async () => {
    const balance = await provider.getBalance(address);
    console.log(`Your address: ${address}`);
    console.log(`Your balance: ${ethers.utils.formatEther(balance)} ETH`);
}

main()