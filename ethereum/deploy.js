import {Web3} from "web3";
import campaignFactory from "./build/CampaignFactory.json" assert {type:"json"}

const web3 = new Web3("http://127.0.0.1:8545/");

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);
    const result = await new web3.eth.Contract(campaignFactory.abi)
        .deploy({
                data: "0x" + campaignFactory.evm.bytecode.object
            }
        )
        .send({gas: '3000000', from: accounts[0]});

    console.log("contract deployed to address", result.options.address);
}

await deploy();