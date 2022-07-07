const provider = new ethers.providers.Web3Provider(window.ethereum);

const tokenAddress = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1";
const tokenABI = [
    "function symbol() view returns (string)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
];

const main = async() => {

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    console.log(userAddress);

    document.getElementById("userAddress").innerText = userAddress.slice(0, 8) + "...";

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    console.log(tokenContract);

    const symbol = await tokenContract.symbol();
    console.log(symbol);
    document.getElementById("tokenName").innerText = symbol;
    const balance = await tokenContract.balanceOf(userAddress);
    const formatedBalance = ethers.utils.formatEther(balance);
    document.getElementById("tokenBalance").innerText = formatedBalance.slice(0, 10);
}

main();

  