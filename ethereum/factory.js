import web3 from './web3.js'
import CampaignFactory from './build/CampaignFactory.json' assert {type: 'json'};

const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;