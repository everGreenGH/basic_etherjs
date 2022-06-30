const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const address = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1"; // New Penguin Token Contract

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
];

const contract = new ethers.Contract(address, ERC20_ABI, provider);

const main = async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();

    console.log(`Reading from ${address}`);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Total Supply: ${totalSupply}`);
}

main()
