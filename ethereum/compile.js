import path from "path";
import solc from "solc";
import fs from "fs-extra"


const buildPath = path.resolve(process.cwd(), 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(process.cwd(), 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts

fs.ensureDirSync(buildPath);

for (let contractFile in output) {
  Object.keys(output[contractFile]).forEach((contract) => {
    fs.outputJsonSync(path.resolve(buildPath, contract + '.json'), output[contractFile][contract]);
  });
}
