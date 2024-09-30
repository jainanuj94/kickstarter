import web3 from './web3.js'
import Campaign from './build/Campaign.json' assert {type: 'json'};

const instance = async (address) => {
    return new web3.eth.Contract(Campaign.abi, address);
}
export default instance;