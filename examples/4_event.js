// const { ethers } = require("ethers");

// const INFURA_ID = ''
// const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)

// const ERC20_ABI = [
//     "function name() view returns (string)",
//     "function symbol() view returns (string)",
//     "function totalSupply() view returns (uint256)",
//     "function balanceOf(address) view returns (uint)",

//     "event Transfer(address indexed from, address indexed to, uint amount)"
// ];

// const address = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
// const contract = new ethers.Contract(address, ERC20_ABI, provider)

// const main = async () => {
//     const block = await provider.getBlockNumber()

//     const transferEvents = await contract.queryFilter('Transfer', block - 1, block)
//     console.log(transferEvents)
// }

// main()

const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const address = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1"; // New Penguin Token Contract
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
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
