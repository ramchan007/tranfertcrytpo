const EthereumNetwork = require("../ethereumNetwork");

async function exampleEthereumNetWork() {
  //DEFINE DATAS
  const sendersData = {
    address: "0x40b43d492bed2Fa90B30CA1618530c1a6b7601C7",
    privateKey:
      "80cb2fc3b7f8ad2fb15c5b87260a8b4359f640a3765e870733eeea256f9675c6",
  };
  const amount = 0.1;
  const chainId = 3; //chainId - mainnet: 1, rinkeby: 4, ropsten 3
  const  recieverData = { address: 0x53c0723d19213a6a8f0584b39600445ab31f0010 }

  const INFURA_PROJECT_ID = "66c4b87046104259a568349d87ba03d1"; //only for ETHEREUM NETWORKS


  //TRANSACTION
  var trs = new EthereumNetwork(INFURA_PROJECT_ID, sendersData);

  var result = await trs.transact(recieverData,
    chainId,
    amount
  );
  console.log(result);
}
exampleEthereumNetWork();
