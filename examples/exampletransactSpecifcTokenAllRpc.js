
const TranfertSpecificTokenAllRpc = require("../TranfertSpecificTokenAllRpc");
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
  
example();