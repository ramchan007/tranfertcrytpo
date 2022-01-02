
## --------------------------------------------
## TRANSACT TOKEN FROM YOUR WALLET USING NODE JS
## --------------------------------------------

## Roadmap 

- [x] Init project
- [x] Transaction on ethereum mainnet
- [X] Transaction on ethereum rinkeby
- [x] Transaction on ethereum ropsten
- [X] Transaction on Binance smart chain
- [X] Transaction on Binance test chain
- [X] Specify the token to send
- [X] All network



## TRANSACTION BNB ON BINANCE ETHER ON ETHEREUM
```
This module aims to permit you to make the transaction in your backend (nodejs) without using your wallet(metamask) to confirm.

By just importing your secret key and specifying : 
    - the account & private key of the sender 
    - receiver wallet address
    - chain Id (You can get your network chain ID in https://chainlist.org/, by just typing your network in the search bar)
    - Infura project ID (https://infura.io/)
```




### Before going in the code
```
create your project on infura and copy the id. You will need it to interact with ethereum networks
https://infura.io/

(ONLY FOR ETHEREUM NETWORK)
```


### How implement

```
1 - Install the module in your project

npm i tranfertcrytpo
```  

```
2 - import the module : 

Example : 

let tranfertcrytpo =  require("tranfertcrytpo");
```


```
3 - Create TransfertCrypto instance

    @params : 
        - INFURA_PROJECT_ID , 
        - { "address" : sender_wallet_address, sender_Wallet_privateKey}

Example : 
* Ethereum NetWorks
var trs = new tranfertcrytpo.EthereumNetwork(INFURA_PROJECT_ID, sendersData);


* Binance NetWorks
var trs = new tranfertcrytpo.BinanceNetwork(sendersData);
```

```
4 - Call transact method on the TransfertCrypto instance 'trs'

    @params :  
        - { "address" : recipient_wallet_address}
        - chainID (network_ID),
        - amount (in ether)


Example : 
* Ethereum NetWorks (ropsten for this example, chainId = 3)

const results = await trs.transact({ "address" : 0x53C0723D19213A6a8f0584B39600445ab31F0010}, 3, amount)
```

```
5 - Interpret the response


SUCCESS : 
{
  error: false,
  result: {
    id: 'transaction_id',
    link: 'link to see the transaction on the corresponding network etherscan'
  }
}




Example : 
* Ethereum
{
  error: false,
  result: {
    id: '0x99593747604fb3b0dd23329ff240905063a3cf444a8663f103bb2714e19fa895',
    link: 'https://ropsten.etherscan.io/tx/0x99593747604fb3b0dd23329ff240905063a3cf444a8663f103bb2714e19fa895'
  }
}

* Binance

{
  error: false,
  result: {
    id: '0xddeddc5e744d1d0f59d002b2e76661b1ad89487bd4ef462f75a124aee9332be7',
    link: 'https://testnet.bscscan.com/tx/0xddeddc5e744d1d0f59d002b2e76661b1ad89487bd4ef462f75a124aee9332be7'
  }
}


ERROR : 
{
  error: true,
  result: "error message"
}

Example : 
{
  error: true,
  result: 'Error: Expected private key to be an Uint8Array with length 32'
}

```



## TRANSACTION SPECIFIED TOKEN ON BINANCE OR ETHEREUM

### Before going in the code
```

To transfer a token you want, you will need : 
   - token ABI and token Address

For the ethereum network, you will need infura project id
```


### How to implement 
```
1 - Install the module in your project

npm i tranfertcrytpo
```  

```
2 - import the module : 

Example : 
const  tranfertcrytpo = require('tranfertcrytpo'); 

```


```
3 - Create TransfertCrypto instance

    @params : 
        - INFURA_PROJECT_ID, only on ethereum network, for binance just past empty string ""
        - { "address" : sender_wallet_address, sender_Wallet_privateKey}
        - sendersData
        - tokenAbi
        - tokenAddress

Example : 
let tranfertpecificToken = new  tranfertcrytpo.TranfertpecificToken(INFURA_PROJECT_ID, sendersData, tokenAbi , tokenAddress);

```

```
4 - Call transact method on the TransfertCrypto instance 'trs'

    @params :  
        - { "address" : recipient_wallet_address}
        - chainID (network_ID),
        - amount (in ether)


Example : 
let result = await tranfertpecificToken.transact(recieverData,3, 200);
console.log( result);
```


```
5 - Interpret the response

{
  error: boolean,
  url : "" //if error = false
  result: {} or string
}

Example : 
{
  error : false,
  url: 'https://testnet.bscscan.com/tx/0xf9d96694c1100bcd4db23143737f72dabbe43e8b4957292e8f289add3e5a01fc',
  result: {
    blockHash: '0x783df1bd3732d9716dd39c6995f69d8c75dfe76e2a9d7426731e8a5bf0bb7a8f',
    blockNumber: 15513877,
    contractAddress: null,
    cumulativeGasUsed: 590420,
    from: '0x53c0723d19213a6a8f0584b39600445ab31f0010',
    gasUsed: 38003,
    logsBloom: '0x00000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000008000000000000100000000000000000000000000000000000000000000000000000000800000000000000000000080010000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004002010000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000',
    status: true,
    to: '0xf09d317400a0450d8f7362051447d6846aeafa64',
    transactionHash: '0xf9d96694c1100bcd4db23143737f72dabbe43e8b4957292e8f289add3e5a01fc',
    transactionIndex: 5,
    type: '0x0',
    events: { Transfer: [Object] }
  }
}
```



## TRANSACTION BY SPECIFYING YOUR NETWORK CONFIG AND YOUR TOKEN INFORMATION

```
Example : 

const tranfertcrytpo = require("tranfertcrytpo");
const Config = require("../utils/config");

async function example() {
    const sendersData = {
      address: "0x53C0723D19213A6a8f0584B39600445ab31F0010",
      privateKey:
        "4cd43beb757ea781def9f5a852c3387a5551ba0e51ab15f5a40383c95376a09b",
    };
    let tokenAbi = Config.tokenAbi;
    let tokenAddress = "0xf09d317400A0450D8f7362051447d6846aeAFa64";
    let INFURA_PROJECT_ID = ""; //when interact with binance didn't need infura project ID
    let network_name ="Binance testnet";
    let explorerUrl =  `https://testnet.bscscan.com/tx/`; //+transaction_id;
    let rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545";
    
    let tranfertSpecificTokenAllRpc = new TranfertSpecificTokenAllRpc(INFURA_PROJECT_ID, sendersData, tokenAbi , tokenAddress, network_name,rpcUrl,explorerUrl);
   
   
    try {
      let chainId = 97;
      let recieverData = { address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7" }
      let amountToSend = 100;

      let result = await tranfertSpecificTokenAllRpc.transact(recieverData,chainId, amountToSend);

       console.log( result);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
}
  
```