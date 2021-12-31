const axios = require("axios").default;
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;

module.exports =  class TransfertCrypto {

    sendersData = {};
  
    constructor(sendersData) {
      this.sendersData = sendersData;
    }

  async getNetworkData(chainId) {
    let network_name = "";
    let rpcUrl = "";
    let url = ""

    switch (chainId) {
      case 56:
        network_name = "Binance Smart Chain";
        url = `https://bscscan.com/tx/`; //+transaction_id;
        rpcUrl = "https://bsc-dataseed1.binance.org:443";
        break;
      case 97:
        network_name = "Binance Smart Chain Testnet";
        url = `https://testnet.bscscan.com/tx/`; //+transaction_id;
        rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545";
        break;
    }

    return { network_name, rpcUrl, url };
  }

  createRandomAccount() {
    //Create random accound
    const account = web3.eth.accounts.create();
    console.log(account);
    /*
  {
    address: '0x423c37FDce415AdC8972197d6c3321ff0bce215B',
    privateKey: '0xe5682e7356e5a04a0ec1266294acc7e1c08d4b2e9c1355835f2c54313c074e17',
  }
  */
    return account;
  }

  importExistingWallet() {
    return new Promise((resolve, reject) => {
      try {
        const account = web3.eth.accounts.privateKeyToAccount(
          this.sendersData.privateKey
        );
        console.log(account);
        return resolve(account);
      } catch (error) {
        console.log("error");
        return reject(error);
      }
    });
  }

  async getBalance(address, chainId) {
    let newtWorkMetada = await this.getNetworkData(chainId);
    console.log(newtWorkMetada.rpcUrl);

    return new Promise((resolve, reject) => {
      //get Network Metadata

      let web3;

      try {
        // testnet
        web3 = new Web3(newtWorkMetada.rpcUrl);
      } catch (error) {
        console.log("error");
        return reject(error);
      }

      try {
        web3.eth.getBalance(address, async (err, result) => {
          if (err) {
            return reject(err);
          }
          //resolve(web3.utils.fromWei(result, "ether"));
          let balance = web3.utils.fromWei(result, "ether");
          ``;
          console.log("BALANCE : " + balance + " ETH");
          return resolve(balance);
        });
      } catch (error) {
        console.log("error");
        return reject(error);
      }
    });
  }

  //getBalance( this.sendersData.address, 56)

  async getCurrentGasPrices() {
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

  async transferFundOnBinance(recieverData, chainId, amountToSend) {
    let newtWorkMetada = await this.getNetworkData(chainId);
    //get Network Metadata
    console.log(newtWorkMetada.rpcUrl);

    return new Promise(async (resolve, reject) => {
      let web3;

      try {
        // testnet
        web3 = new Web3(newtWorkMetada.rpcUrl);
      } catch (error) {
        console.log("error");
        return reject(error);
      }
      var nonce = await web3.eth.getTransactionCount( this.sendersData.address);
      console.log("amountToSend : " + amountToSend);

      let balance = await this.getBalance( this.sendersData.address, chainId);

      console.log(balance);

      //return;
      if (balance < amountToSend) {
        console.log("insufficient funds");
        return reject("insufficient funds");
      }

      let gasPrices = 0;

      try {
        gasPrices = await this.getCurrentGasPrices();
      } catch (error) {
        return reject(error);
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

      let privateKey =  this.sendersData.privateKey;
      let privKey = "";

      try {
        privKey = Buffer.from(privateKey, "hex");
      } catch (error) {
        console.log("error");
        return reject(error);
      }

      //BINANCE
      let chain;
      if (chainId === 56) {
        chain = Common.forCustomChain(
          "mainnet",
          {
            name: "bnb",
            networkId: chainId, //56
            chainId: chainId, //56
          },
          "petersburg"
        );
      } else if (chainId === 97) {
        chain = Common.forCustomChain(
          "mainnet",
          {
            name: "bnb",
            networkId: chainId, //97
            chainId: chainId, //97
          },
          "petersburg"
        );
      } else {
        return reject("Network Not Found");
      }

      const transaction = new EthereumTx(details, { common: chain });
      transaction.sign(privKey);

      const serializedTransaction = transaction.serialize();
      const raw = "0x" + serializedTransaction.toString("hex");

      web3.eth.sendSignedTransaction(raw, (err, id) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log("txHash:", id);
        /*
          id: 0xefcc939dd9110cf945c00fd7c24b49a968471152f96e0859b4ed5bc062708c0a
          */

        let link = newtWorkMetada.url + id;
        resolve({ id: id, link: link });
        
      });
    });
  }

  async transact(recieverData, chainId, amount) {
    //56 : MAINNET && 97 TESTNET
    if (chainId != 56 && chainId != 97) {
      return {
        error: false,
        result:
          "The chain Id must be 56 for BINANCE MAINNET OR 97 for BINANCE TESTNET",
      };
    }
    try {
      let result = await this.transferFundOnBinance(
        recieverData,
        chainId /*chainId*/,
        amount
      );
      return {
        error: false,
        result: result,
      };
    } catch (e) {
      console.log(e);
      return {
        error: true,
        result: e ? e.toString() : e,
      };
    }
  }
};

