import { Web3 } from "web3"
import assert from "assert"
import compiledFactory from '../ethereum/build/CampaignFactory.json' assert {type: 'json'}
import compiledCampaign from '../ethereum/build/Campaign.json' assert {type: 'json'}

const web3 = new Web3("http://127.0.0.1:8545/")

let accounts;
let factory;
let campaign;
let campaignAddress;

describe('Campaign Test', () => {

  beforeEach('Setup', async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: "0x" + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '30000000'});

    await factory.methods.createCampaign('100').send({from: accounts[0], gas: '1000000'});

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
  })

  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  })

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try{
      await campaign.methods.contribute().send({
        from: accounts[0],
        value:'5'
       });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
        .createRequest('Buy bread', '100', accounts[1])
        .send({from: accounts[0], gas:'1000000'});

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'Buy bread');
    assert.equal(request.value, 100);
    assert.equal(request.recipient, accounts[1]);
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei(10, 'ether')
    });

    await campaign.methods
        .createRequest('Buy bread', web3.utils.toWei(5, 'ether'), accounts[1])
        .send({from: accounts[0], gas:'1000000'});

    await campaign.methods.approveRequest(0).send({from: accounts[0], gas:'1000000'});
    await campaign.methods.finalizeRequest(0).send({from: accounts[0], gas: '1000000'});

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 10000)
  });
})
