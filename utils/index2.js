const axios = require("axios").default;
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;
//import {parse} from 'ts-command-line-args';

console.log(Common)

// testnet
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

const sendersData = { address: '0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7', privateKey: '80cb2fc3b7f8ad2fb15c5b87260a8b4359f640a3765e870733eeea256f9675c6' };
const receiverData = { address: "0x2afD3998bF1b47f3cb196eDd0DC1E35Af3911A56" };


async function getNetworkData(chainId) {
  let ethNetwork = "";
  let network_name = "";
  let rpcUrl = "";
  switch (chainId) {
    case 56:
      network_name = "Binance Smart Chain";
      url = `https://bscscan.com/`; //+transaction_id;
      rpcUrl = 'https://bsc-dataseed1.binance.org:443';
      break;
    case 97:
      network_name = "Binance Smart Chain Testnet";
      url = `https://testnet.bscscan.com/tx/0xefcc939dd9110cf945c00fd7c24b49a968471152f96e0859b4ed5bc062708c0a`; //+transaction_id;
      rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';

      break;
  }

  return { network_name, ethNetwork, url };
}


function createRandomAccount() {
  //Create random accound
  const account = web3.eth.accounts.create();
  console.log(account)
  /*
  {
    address: '0x423c37FDce415AdC8972197d6c3321ff0bce215B',
    privateKey: '0xe5682e7356e5a04a0ec1266294acc7e1c08d4b2e9c1355835f2c54313c074e17',
  }
  */
  return account;
}


function importExistingWallet() {
  return new Promise((resolve, reject) => {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(sendersData.privateKey)
      console.log(account)
      return resolve(account)
    } catch (error) {
      console.log("error");
      return reject(error);
    }
  })
}


async function getBalance(address, chainId) {
  return new Promise((resolve, reject) => {
    try {
      web3.eth.getBalance(address, async (err, result) => {
        if (err) {
          return reject(err);
        }
        //resolve(web3.utils.fromWei(result, "ether"));
        let balance = web3.utils.fromWei(result, "ether"); ``
        console.log("BALANCE : " + balance + " ETH");
        return resolve(balance);
      });
    } catch (error) {
      console.log("error");
      return reject(error);
    }

  });
}

//getBalance(sendersData.address, 56)


async function getCurrentGasPrices() {
  let response = await axios.get(
    "https://ethgasstation.info/json/ethgasAPI.json"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
}

async function transferFund(recieverData, chainId, amountToSend) {
  return new Promise(async (resolve, reject) => {
    var nonce = await web3.eth.getTransactionCount(sendersData.address);
    console.log("amountToSend : " + amountToSend);

    let balance = await getBalance(sendersData.address, 56);

    console.log(balance);

    //return;
    if (balance < amountToSend) {
      console.log("insufficient funds");
      return reject("insufficient funds");
    }

    let gasPrices = 0;

    try {
      gasPrices = await getCurrentGasPrices();
    } catch (error) {
      return reject();
    }

    let details = {
      to: recieverData.address,
      value: web3.utils.toHex(
        web3.utils.toWei(amountToSend.toString(), "ether")
      ),
      gas: 21000,
      gasPrice: gasPrices.low * 1000000000,
      nonce: nonce,
      chainId: chainId,
    };


    let privateKey = sendersData.privateKey;
    let privKey = "";

    try {
      privKey = Buffer.from(privateKey, "hex");
    } catch (error) {
      console.log("error");
      return reject(error);
    }

    //BINANCE
    const common = Common.forCustomChain('mainnet', {
      name: 'bnb',
      networkId: 56,
      chainId: 56
    }, 'petersburg');

    const chain = Common.forCustomChain(
      'mainnet', {
        name: 'bnb',
        networkId: 97,
        chainId: 97
      },
      'petersburg'
    )

    const transaction = new EthereumTx(details, { common: chain });
    transaction.sign(privKey);

    const serializedTransaction = transaction.serialize();
    const raw = '0x' + serializedTransaction.toString('hex');

    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log('txHash:', txHash)
      /*
      txHash: 0xefcc939dd9110cf945c00fd7c24b49a968471152f96e0859b4ed5bc062708c0a
       */
    });

  });
}

transferFund(receiverData, 56, 0.1);