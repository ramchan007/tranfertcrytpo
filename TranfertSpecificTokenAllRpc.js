const axios = require("axios").default;
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;

module.exports = class TranfertSpecificTokenAllRpc {
  PROJECT_ID = "";
  sendersData = {};
  tokenAbi = [];
  tokenAdress = "";
  network_name = "";
  rpcUrl = "";
  explorerUrl = "";

  constructor(
    PROJECT_ID,
    sendersData,
    tokenAbi,
    tokenAdress,
    network_name,
    // chainId,
    rpcUrl,
    explorerUrl
  ) {
    this.PROJECT_ID = PROJECT_ID;
    this.sendersData = sendersData;
    
    this.network_name = network_name;
    // this.chainId = chainId;
    this.rpcUrl = rpcUrl;
    this.explorerUrl = explorerUrl;

    this.tokenAbi = tokenAbi;
    this.tokenAdress = tokenAdress;
  }

  formatToken(web3, amount) {
    return web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether"));
  }

  getNetworkData() {
    return {
      error: false,
      network_name: this.network_name,
      rpcUrl: this.rpcUrl,
      url: this.explorerUrl,
    };
  }

  async transact(recieverData, chainId, amountToSend) {
    if (chainId == 1 || chainId == 3 || chainId == 4) {
      if (this.PROJECT_ID == "") {
        return {
          error: true,
          result: "Please provide infura project ID",
        };
      }
    }
    let newtWorkMetada = this.getNetworkData(chainId);

    if (newtWorkMetada.error) {
      return {
        error: newtWorkMetada.error,
        result: newtWorkMetada.result,
      };
    }
    let web3;
    try {
      // testnet
      web3 = new Web3(newtWorkMetada.rpcUrl);
    } catch (error) {
      console.log("error 0");
      return {
        error: true,
        result: error,
      };
    }

    var nonce = await web3.eth.getTransactionCount(this.sendersData.address);

    //get total supply
    let myContract = await new web3.eth.Contract(
      this.tokenAbi,
      this.tokenAdress,
      {
        from: this.sendersData.address, // default from) address
        gasPrice: "20000000000", // default gas price in wei, 20 gwei in this case
      }
    );

    let balance = 0;

    try {
      balance = await myContract.methods
        .balanceOf(this.sendersData.address)
        .call();
    } catch (error) {
      console.log("error 1");
      console.log(error);
    }

    console.log(balance);
    console.log(amountToSend);

    amountToSend = web3.utils.toWei(amountToSend.toString(), "ether"); //this.formatToken(web3, amountToSend);
    balance = web3.utils.toWei(balance.toString(), "ether"); //this.formatToken(web3, balance);

    console.log(balance);
    console.log(amountToSend);

    //return;
    if (balance < amountToSend) {
      console.log("error 2");
      return {
        error: true,
        result: "insufficient funds",
      };
    }

    await web3.eth.accounts.wallet.add(this.sendersData.privateKey);

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await myContract.methods
      .transfer(recieverData.address, amountToSend)
      .estimateGas({ from: this.sendersData.address });
    let result = {};
    try {
      result = await myContract.methods
        .transfer(recieverData.address, amountToSend)
        .send({
          from: this.sendersData.address,
          gasPrice: gasPrice,
          gas: gasEstimate,
          // default gas price in wei, 20 gwei in this case
        });
    } catch (error) {
      console.log("error 3");
      result = error;
    }

    // console.log(result, result.transactionHash);
    return {
      error: false,
      url: newtWorkMetada.url + result.transactionHash,
      result: result,
    };
  }
};
