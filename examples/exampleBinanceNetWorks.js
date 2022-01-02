const BinanceNetwork = require("../binanceNetwork");

async function exampleBinanceNetWorks() {

  //DEFINE DATAS
  const sendersData = {
    address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7",
    privateKey:
      "80cb2fc3b7f8ad2fb15c5b87260a8b4359f640a3765e870733eeea256f9675c6",
  };
  const amount = 0.1;
  const chainId = 97; //chainId - mainnet: 56 , testnet: 97 
  const  recieverData = { address: "0x53c0723d19213a6a8f0584b39600445ab31f0010" }


  //TRANSACTION
  var trs = new BinanceNetwork(sendersData);
  var result = await trs.transact(recieverData,
    chainId,
    amount
  );
  console.log(result);
}

exampleBinanceNetWorks();
