const axios = require("axios").default;
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;

// const CHAIN_ID = 3; // EIP 155 chainId - mainnet: 1, rinkeby: 4, ropsten 3

module.exports =  class EthereumNetwork {
  PROJECT_ID = "";
  sendersData = {};

  constructor(PROJECT_ID, sendersData) {
    this.PROJECT_ID = PROJECT_ID;
    this.sendersData = sendersData;
  }
  
  async getNetworkData(chainId) {
    let ethNetwork = "";
    let network_name = "";
    let url = "";
    switch (chainId) {
      case 1:
        url = `https://etherscan.io/tx/`; //+transaction_id;
        network_name = "mainet";
        ethNetwork = `https://mainnet.infura.io/v3/${this.PROJECT_ID}`;
        break;
      case 3:
        network_name = "ropsten";
        url = `https://ropsten.etherscan.io/tx/`; //+transaction_id;
        ethNetwork = `https://ropsten.infura.io/v3/${this.PROJECT_ID}`;
        break;
      case 4:
        network_name = "rinkeby";
        url = `https://rinkeby.etherscan.io/tx/`; //+transaction_id;
        ethNetwork = `https://rinkeby.infura.io/v3/${this.PROJECT_ID}`;
        break;
    }

    return { network_name, ethNetwork, url };
  }

  async transferFund(recieverData, chainId, amountToSend) {

    let newtWorkMetada = await this.getNetworkData(chainId); //get Network Metadata
    let web3;

    try {
      web3 = new Web3(
        new Web3.providers.HttpProvider(newtWorkMetada.ethNetwork)
      );
    } catch (error) {
      console.log("error1");
      return reject(error);
    }


    return new Promise(async (resolve, reject) => {
      var nonce = await web3.eth.getTransactionCount(this.sendersData.address);

      web3.eth.getBalance(this.sendersData.address, async (err, result) => {

        if (err) {
          console.log("error2");
          return reject(err);
        }

        // console.log(result);

        let balance = web3.utils.fromWei(result, "ether");

        console.log(balance + " ETH");
        console.log("amountToSend : " + amountToSend);

        if (balance < amountToSend) {
          console.log("insufficient funds");
          return reject("insufficient funds");
        }
        let gasPrices = 0;

        try {
          gasPrices =  await this.getCurrentGasPrices();
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
          chainId: chainId || 3, // EIP 155 chainId - mainnet: 1, rinkeby: 4, ropsten 3
        };
        

        const transaction = new EthereumTx(details, {
          chain: `${newtWorkMetada.network_name}`,
        });
        let privateKey = this.sendersData.privateKey;
        let privKey = "";

        try {
          privKey = Buffer.from(privateKey, "hex");
          transaction.sign(privKey);
        } catch (error) {
          console.log("error");
          return reject(error);
        }


        const serializedTransaction = transaction.serialize();

        web3.eth.sendSignedTransaction(
          "0x" + serializedTransaction.toString("hex"),
          (err, id) => {
            if (err) {
              // console.log(err);
              return reject(err);
            }
            let link = newtWorkMetada.url + id;
            resolve({ id: id, link: link });
          }
        );
      });
    });
  }

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

  async getBalance(address, chainId) {
    let newtWorkMetada = await this.getNetworkData(chainId); //get Network Metadata
    let web3;
    try {
      web3 = new Web3(
        new Web3.providers.HttpProvider(newtWorkMetada.ethNetwork)
      );
    } catch (error) {
      console.log("error");
      return reject(error);
    }
    
    return new Promise((resolve, reject) => {
      try {
        web3.eth.getBalance(address, async (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(web3.utils.fromWei(result, "ether"));
        });
      } catch (error) {
        console.log("error");
        return reject(error);
      }
     
    });
  }
  
  async transact(recieverData, chainId, amount) {
    try {
      let result = await this.transferFund(
        recieverData,
        chainId /*chainId*/,
        amount
      );
      return {
        error: false,
        result: result,
      };
    } catch (e) {
      // console.log(e);
      return {
        error: true,
        result: e.toString(),
      };
    }
  }
}