const axios = require("axios").default;
const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;

module.exports = class TransactSpecificToken {
  PROJECT_ID = "";
  sendersData = {};
  tokenAbi = [];
  tokenAdress = "";

  constructor(PROJECT_ID, sendersData, tokenAbi, tokenAdress) {
    this.PROJECT_ID = PROJECT_ID;
    this.sendersData = sendersData;
    this.tokenAbi = tokenAbi;
    this.tokenAdress = tokenAdress;
  }

  formatToken(web3, amount) {
    return web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether"));
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

  getNetworkData(chainId) {
    let network_name = "";
    let rpcUrl = "";
    let url = "";

    switch (chainId) {
      case 1:
        url = `https://etherscan.io/tx/`; //+transaction_id;
        network_name = "mainet";
        rpcUrl = `https://mainnet.infura.io/v3/${this.PROJECT_ID}`;
        break;
      case 3:
        network_name = "ropsten";
        url = `https://ropsten.etherscan.io/tx/`; //+transaction_id;
        rpcUrl = `https://ropsten.infura.io/v3/${this.PROJECT_ID}`;
        break;
      case 4:
        network_name = "rinkeby";
        url = `https://rinkeby.etherscan.io/tx/`; //+transaction_id;
        rpcUrl = `https://rinkeby.infura.io/v3/${this.PROJECT_ID}`;
        break;
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
      default:
        return {
          error: true,
          result: "This network is not define !",
        };
    }

    return { error: false, network_name, rpcUrl, url };
  }

  async transact(recieverData, chainId, amountToSend) {
    if(chainId == 1 || chainId == 3 || chainId == 4  ){
       if(this.PROJECT_ID == ""){
          return {
            error : true,
            result : "Please provide infura project ID"
          }
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

    let gasPrices = 0;

    try {
      gasPrices = await this.getCurrentGasPrices();
    } catch (error) {
      return {
        error: true,
        result: error,
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
      console.log("error 3")
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

/*

BINANCE RESULT : 

{
  blockHash: '0xf6886cb7e8afa04f41c39cbb6777f4ba6142bf05bd1dba63214420ae64209eca',
  blockNumber: 15488930,
  contractAddress: null,
  cumulativeGasUsed: 1267176,
  from: '0x40b43d492bed2fa90b30ca1618530c1a6b7601c7',
  gasUsed: 37943,
  logsBloom: '0x00000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000100000000000000000000000000000000000000000000000000000000800000000000000400000080010000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004002000000000000000000000800000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0xf09d317400a0450d8f7362051447d6846aeafa64',
  transactionHash: '0x3746837980f09d12786ff780cac22b0b8995376978fc0cb990791332bdbef02a',
  transactionIndex: 11,
  type: '0x0',
  events: {
    Transfer: {
      address: '0xf09d317400A0450D8f7362051447d6846aeAFa64',
      blockNumber: 15488930,
      transactionHash: '0x3746837980f09d12786ff780cac22b0b8995376978fc0cb990791332bdbef02a',
      transactionIndex: 11,
      blockHash: '0xf6886cb7e8afa04f41c39cbb6777f4ba6142bf05bd1dba63214420ae64209eca',
      logIndex: 11,
      removed: false,
      id: 'log_ea0853a8',
      returnValues: [Result],
      event: 'Transfer',
      signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      raw: [Object]
    }
  }
}
*/


/**
 ETHEREUM RESULT 
{
  url: 'https://ropsten.etherscan.io/tx/0x0d2e603a7313f265e716e356af95fccc4ed58a5f3f17b7879893d44a25cf0761',
  result: {
    blockHash: '0x80ca5891912994a434de31c9ed92281c5b469da6317cdc334c5b6d16b03c51ae',
    blockNumber: 11738236,
    contractAddress: null,
    cumulativeGasUsed: 7636000,
    effectiveGasPrice: '0x5c325c59',
    from: '0x40b43d492bed2fa90b30ca1618530c1a6b7601c7',
    gasUsed: 35655,
    logsBloom: '0x00000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000080000000000000000000000008000000000000000200000000000000000000000000000000000000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004002010000000000000000000008000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000',
    status: true,
    to: '0x04697911a30e81d996acd1f7d75fc81511757e50',
    transactionHash: '0x0d2e603a7313f265e716e356af95fccc4ed58a5f3f17b7879893d44a25cf0761',
    transactionIndex: 11,
    type: '0x0',
    events: { Transfer: [Object] }
  }
}
touresouleymane@192 tranfertcrytpo % 

 */