
const TranfertpecificToken = require("../TranfertpecificToken");
const Config = require("../utils/config");

async function example_binance_token() {
    const sendersData = {
      address: "0x53C0723D19213A6a8f0584B39600445ab31F0010",
      privateKey:
        "4cd43beb757ea781def9f5a852c3387a5551ba0e51ab15f5a40383c95376a09b",
    };
    let tokenAbi = Config.tokenAbi;
    let tokenAddress = "0xf09d317400A0450D8f7362051447d6846aeAFa64";
    let INFURA_PROJECT_ID = ""; //when interact with binance didn't need infura project ID


    let tranfertpecificToken = new TranfertpecificToken(INFURA_PROJECT_ID, sendersData, tokenAbi , tokenAddress);

    try {
      let chainId = 97;
      let recieverData = { address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7" }
      let amountToSend = 5010;


      let result = await tranfertpecificToken.transact(recieverData,chainId, amountToSend);
      console.log( result);

    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
}
  


async function example_ethereum_token() {
  //ACCOUNT 2
  const sendersData = {
    address: "0x2afD3998bF1b47f3cb196eDd0DC1E35Af3911A56",
    privateKey:
      "2d406160cd96bc2b8b48a16d1e18bb6f02fc5c28ead531ff629d7d0615c762e9",
  };
  let tokenAbi = Config.tokenAbi;
  let tokenAddress = "0x4999aaba71D0531219d8d874fF02C5C40CE18ace";
  const  recieverData = { address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7" };
  const INFURA_PROJECT_ID = "66c4b87046104259a568349d87ba03d1"; //only for ETHEREUM NETWORKS

  
  let TranfertpecificToken = new TranfertpecificToken(INFURA_PROJECT_ID, sendersData, tokenAbi, tokenAddress);

  let result = await TranfertpecificToken.transact(recieverData,3, 200);
  console.log( result);
}

async function example_ethereum_token2() {
  const sendersData = {
    address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7",
    privateKey:
      "80cb2fc3b7f8ad2fb15c5b87260a8b4359f640a3765e870733eeea256f9675c6",
  };
  let tokenAbi = Config.tokenAbi;
  let tokenAddress = "0x04697911a30e81D996acd1F7d75fC81511757E50";
  const  recieverData = { address: "0x53C0723D19213A6a8f0584B39600445ab31F0010" };
  const INFURA_PROJECT_ID = "66c4b87046104259a568349d87ba03d1"; //only for ETHEREUM NETWORKS

  
  let TranfertpecificToken = new TranfertpecificToken(INFURA_PROJECT_ID, sendersData, tokenAbi, tokenAddress);

  let result = await TranfertpecificToken.transact(recieverData,3, 10000);
  console.log( result);
}

example_binance_token();
//example_ethereum_token();
//example_ethereum_token2();