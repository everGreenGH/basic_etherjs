# 5주차: Ethers.js 실습

4주차에서는 Hardhat 개발환경 구축과 간단한 컨트랙트를 Alchemy를 통하여 테스트넷에 배포하는 실습을 통하여, 컨트랙트가 어떠한 프로세스로 배포되는지에 대하여 대략적인 흐름을 살펴보았습니다.

**Ethers.js는 개발자가 이더리움 블록체인과 상호 작용할 수 있도록 도와 주는 Javascript 기반 라이브러리입니다.** 5주차에는 Ethers.js 실습을 통하여 Ethers.js의 문법을 익히고, 스마트 컨트랙트에 접근하는 방법들에 대하여 학습할 것입니다.

<aside>
💡 아래 내용을 학습하면서, 내용에 해당하는 부분을 [Ethers.js Docs](https://docs.ethers.io/v5/)에서 직접 찾아보세요.

</aside>

### 개발 환경 구축

우선, 폴더를 생성한 후 Visual Studio Code를 통하여 불러온 후 커맨드에 아래 명령어를 통하여 샘플 코드를 가져옵니다.

```bash
git clone https://github.com/everGreenGH/basic_etherjs
```

Examples 폴더 안에 있는 예제 소스코드들을 모두 삭제한 후, 아래 명령어를 입력하여

```bash
npm install
```

실습에 필요한 패키지들을 설치합니다. 

secrets.json을 생성한 후, 아래와 같이 작성합니다. API KEY와 개인키는 본인의 것으로 변경합니다.

```json
{
    "alchemyApiKey": "Alchemy에서 가져온 API KEY",
    "privateKey": "ETHEREUM WALLET 개인키"
}
```

### 이더리움 블록체인에 접근하기

Ethers.js를 통하여 이더리움 블록체인에 접근하는 방법에 대하여 알아봅시다. Examples 폴더 안에 “1_accounts.js” 파일을 생성하고, 아래의 코드를 작성합니다.

```jsx
const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);
```

- *require(”ethers”)* 를 통하여 Ethers.js를 불러올 수 있습니다.
- *providers.JsonRpcProvider(api)* 는 이더리움 블록체인과 상호작용하는 방법 중 하나입니다. 위에서 언급하였듯이, 이번 실습에서는 Alchemy API를 사용합니다. 따라서, Alchemy API key를 통하여 Week 2에서 사용하였던 Rinkeby 테스트넷에 접속할 수 있습니다.

 

아래의 코드를 이어서 작성합니다.

```jsx
const address = "0x3338f7c7a0ABAC5C20e8d2ACa03E8C25fe31304F";

const main = async () => {
    const balance = await provider.getBalance(address);
    console.log(`Your address: ${address}`);
    console.log(`Your balance: ${ethers.utils.formatEther(balance)} ETH`);
}

main()
```

- *utils.formatEther(value)* 는 단위 변환을 위하여 Ethers.js에서 제공하는 함수입니다. 이 함수는 wei 단위의 value를 ether 단위로 변환하는 함수입니다 (추가적으로 단위 변환을 제공하는 함수는 [Docs의 해당 내용](https://docs.ethers.io/v5/api/utils/display-logic/)을 참고하세요).

![Ethereum의 기본 단위들(출처: Ethers.js docs)](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a4b05fb-9090-4e37-8a11-1eafcf04a997/Untitled.png)

Ethereum의 기본 단위들(출처: Ethers.js docs)

터미널에 아래의 코드를 작성하여 1_accounts.js를 실행합니다(*node* 는 node.js에서 프로그램을 실행하는 키워드입니다). 아래 사진과 같이 결과가 나오는지 확인합니다.

```bash
node ./examples/1_accounts.js
```

### 스마트 컨트랙트에 접근하기

Ethers.js를 통하여 스마트 컨트랙트에 접근하는 방법을 알아봅시다. Examples 폴더 안에 “2_contracts.js” 파일을 생성하고, 아래의 코드를 작성합니다.

<aside>
💡 스마트 컨트랙트에 접근한다는 개념을 이해하기 위하여, 스마트 컨트랙트가 EVM에 의하여 컴파일되고 배포되는 과정에 대하여 간단하게 알아볼 필요가 있습니다. 우리는 스마트 컨트랙트를 Solidity와 같은 고급 언어(사람이 인식하기 쉬운 언어)로 작성합니다. EVM은 이러한 고급 언어로 작성된 스마트 컨트랙트를 **기계가 인식할 수 있는 저수준 언어인 EVM Bytecode로 변환**합니다. 
반대로, 웹 어플리케이션에서 스마트 컨트랙트에 접근하려면 EVM Bytecode에 접근하여, 함수와 매개 변수, 상태 변수에 접근합니다. 그러나 EVM Bytecode만으로는 스마트 컨트랙트에 접근할 수 없는데, 이는 함수의 이름과 매개변수들이 컴파일 과정에서 해시되기 때문입니다. 다른 계정이 함수를 호출하기 위해서는 함수 이름과 매개변수들을 알고 있어야 하기 때문에, 이를 위하여 EVM은 EVM Bytecode 외에도 **Contract ABI를 생성**합니다. Contract ABI는 컨트랙트의 함수와 매개변수들을 JSON 형식으로 나타낸 리스트입니다. 이번 실습에서는 Contract ABI에 접근하여, 스마트 컨트랙트와 상호작용합니다.

</aside>

아래의 코드를 작성하세요. 

```jsx
const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const address = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1"; 
// New Penguin Token contract address: 본인의 토큰 컨트랙트 주소로 변경하세요!

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
];

const contract = new ethers.Contract(address, ERC20_ABI, provider);
```

- *provider.JsonRpcProvider(URL/ConnectionInfo)* 는 provider의 일종으로 이더리움 블록체인과 상호작용하는 일반적 방법 중 하나이며, 주로 Infura나 Alchemy와 같은 Third-party 노드 서비스를 이용할 때 사용합니다.
- *Contract(address, abi, signer/provider)* 는 Ethers.js에서 컨트랙트에 접근하기 위하여 사용하는 함수로, 컨트랙트 인스턴스를 통하여 컨트랙트에서 데이터를 가져옵니다.

<aside>
💡 **Provider**는 이더리움 블록체인과의 연결을 추상화하며 주로 provider 인스턴스를 통하여 이더리움 블록체인의 데이터에 접근하는 데에 사용합니다.
**Signer**는 이더리움 계정(Account)을 추상화하며, 주로 signer 인스턴스를 통하여 메시지와 트랜잭션에 서명하고, 트랜잭션을 이더리움 블록체인에 보내 상태 변경을 실행합니다.

</aside>

ERC20_ABI 배열을 생성하여 통하여 필요로 하는 ABI 데이터를 직접 작성합니다. 4주차에 작성한 컨트랙트는 ERC-20 표준을 따르는 컨트랙트이므로, ERC-20 표준에서 사용하는 함수를 이용하여 컨트랙트와 상호작용할 수 있습니다. JSON 파일이 ABI의 입력값이 될 수도 있지만, Solidity 코드 형식으로도 ABI 입력값을 작성할 수 있습니다. [ABI Format에 대하여 자세히 알아보려면 이 링크를 참고하세요.](https://docs.ethers.io/v5/api/utils/abi/formats/)

아래의 코드를 이어서 작성합니다.

```jsx
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
```

- *contract변수.함수()* 를 통하여 컨트랙트의 함수에 접근할 수 있습니다.

터미널을 이용하여 실행하고, 올바른 결과가 나오는지 확인하세요.

**연습문제**

위의 코드를 수정하여, 본인이 소유하고 있는 토큰의 잔고를 출력하도록 코드를 작성하세요. ABI 데이터에 balanceOf 함수([Format](https://eips.ethereum.org/EIPS/eip-20))를 추가하고, main 함수를 수정하여 잔고를 불러와 출력하는 기능을 추가하세요. 잔고는 Ether 단위를 사용해야 합니다.

### 트랜잭션 생성하기

Ethers.js를 통하여 트랜잭션을 생성하는 방법을 알아봅시다. Examples 폴더 안에 “3_transaction.js” 파일을 생성하고, 아래의 코드를 작성합니다.

```jsx
const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const myAddress = "0x3338f7c7a0ABAC5C20e8d2ACa03E8C25fe31304F"; // 송신자
const yourAddress = "0x1310B7F36cEd9Fa73a04fD150CC08f11AcA5dfCb"; // 수신자

const wallet = new ethers.Wallet(privateKey, provider);
```

myAddress에서는 내 이더리움 주소를 작성하고, yourAddress에는 Ether를 전송하고 싶은 사람의 주소를 작성하세요.

- *Wallet(privatekey, provider)* 는 wallet 인스턴스를 생성합니다. Wallet은 Signer의 일종으로, 인스턴스가 개인 키 정보를 저장합니다. Wallet 인스턴스를 통하여 개인키를 이용하여 트랜잭션에 서명할 수 있습니다.

아래의 코드를 이어서 작성합니다.

```jsx
const main = async () => {

    const myBalanceBefore = await provider.getBalance(myAddress);
    const yourBalanceBefore = await provider.getBalance(yourAddress);
    console.log(`Sender's balance before transaction : ${ethers.utils.formatEther(myBalanceBefore)}`);
    console.log(`Receiver's balance before transaction : ${ethers.utils.formatEther(yourBalanceBefore)}\n`);

    const tx = await wallet.sendTransaction({ 
        to: yourAddress, 
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
```

위의 코드는 myAddress에서 yourAddress로 0.025 Ether를 전송하는 트랜잭션을 발생시키고, 트랜잭션 이전과 이후의 잔고를 각각 출력하는 코드입니다.

- *wallet.sendTransaction({Transaction객체})* 는 트랜잭션을 전송하는 함수입니다.
- *utils.parseEther(string)* 은 입력받은 Ether 단위의 숫자를 Wei 단위로 변환합니다.
- *transaction.wait()* 과 await 키워드를 이용하여 트랜잭션이 채굴된 이후 해당 코드 아래의 코드들을 실행하도록 할 수 있습니다. 위의 코드에서, 트랜잭션 이후의 잔고는 트랜잭션이 채굴된 이후 출력되어야 합니다.

터미널을 이용하여 실행하고, 올바른 결과가 나오는지 확인하세요.

**연습문제**

컨트랙트의 transfer 함수와 balanceOf 함수를 사용하여, 위의 코드를 ERC-20 토큰을 전송(수량은 자유롭게)하는 코드로 변경하세요. 위의 *wallet.sendTransaction* 과 *provider.getBalance* 를 transfer 함수와 balanceOf 함수로  대체하세요. (즉, transfer 함수를 이용하여 상대방에게 ERC-20 토큰를 전송하고, balanceOf 함수를 이용하여 transaction 전후 ERC-20 토큰 잔고를 출력해야 합니다.)

- *contract.connect(signer/provider)* 을 통하여 컨트랙트 인스턴스를 Provider나 Signer와 연결할 수 있습니다. 위의 코드에서의 컨트랙트 인스턴스는 Provider와 연결되어 있습니다. 트랜잭션을 수행하기 위해서는 컨트랙트가 Signer에 연결되어 있어야 합니다. Transfer 함수를 실행하기 위해서 컨트랙트 인스턴스에 Wallet을 연결하세요.

### 이벤트 데이터 가져오기

이벤트(Event)는 트랜잭션 로그의 역할을 합니다. Ethers.js를 통하여 이벤트, 즉 트랜잭션 로그 데이터를 가져오는 방법에 대하여 알아보겠습니다.

```jsx
const { ethers } = require("ethers");
const { alchemyApiKey, privateKey } = require("../secrets.json");

const provider = new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`);

const address = "0x858b8BB80eE744BFdF9918E63b4566C1d452a1b1"; // New Penguin Token Contract
const ERC20_ABI = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const contract = new ethers.Contract(address, ERC20_ABI, provider);

const main = async () => {
    const block = await provider.getBlockNumber();
    const transferEvent = await contract.queryFilter('Transfer', block - 1, block);

    console.log(transferEvent);
}

main()
```

위 코드는 위의 트랜잭션 연습문제에서 발생시킨 ERC-20 Transfer 함수 트랜잭션의 이벤트를 가져오는 코드입니다. ABI 코드에는 transfer 함수의 event를 추가하였습니다.

- *contract.queryFilter(event, block(hash)From, blockTo)* 는 blockFrom에서 blockTo 사이에서 event와 맞는 이벤트가 있다면 가져오는 함수입니다.

터미널을 이용하여 출력하고, 올바른 결과가 나오는지 확인하세요.
