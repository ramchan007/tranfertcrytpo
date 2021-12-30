# TRANSACT TOKEN FROM YOUR WALLET USING NODEJS

```
This module aim to permit to make transaction in your backend (nodejs) without use your wallet(metamask) to confirm.

By just importing your secrey key and specifying : 
    - the account & private key of sender 
    - receiver wallet address
    - chain Id (You can get your network chain ID in https://chainlist.org/, by just type your network in the searchbar)
    - Infura project ID (https://infura.io/)
```


## How implement


```
1 - create your project on infura copy the id copy the id 

https://infura.io/
```


```
2 - Install the module in your project

npm i tranfertcrytpo
```  

```
3 - export the module : 

Example : 

const TransfertCrypto = requir('tranfertcrytpo'); 
```


```
4 - Create TransfertCrypto instance

    @params : 
        - INFURA_PROJECT_ID , 
        - { "address" : sender_wallet_address, sender_Wallet_privateKey}

Example : 

var trs = new TransfertCrypto(INFURA_PROJECT_ID, sendersData);
```

```
5 - Call transact method on the TransfertCrypto instnace 'trs'

    @params :  
        - { "address" : recipient_wallet_address}
        - chainID (network_ID),
        - amount (in ether)


Example : 

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

{
  error: false,
  result: {
    id: '0x99593747604fb3b0dd23329ff240905063a3cf444a8663f103bb2714e19fa895',
    link: 'https://ropsten.etherscan.io/tx/0x99593747604fb3b0dd23329ff240905063a3cf444a8663f103bb2714e19fa895'
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


## Roadmap 

- [x] Init project
- [x] Transaction on ethereum mainnet
- [X] Transaction on ethereum rinkeby
- [x] Transaction on ethereum ropsten
- [ ] Transaction on binance smart chain
- [ ] Transaction on binance test chain
- [ ] Transaction on moonriver

