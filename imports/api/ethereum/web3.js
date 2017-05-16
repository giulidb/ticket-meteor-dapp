
import contract from 'truffle-contract';
import _ from 'lodash';
import Web3 from 'web3';

var provider;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    provider = web3.currentProvider;
} else {
    // set the provider you want from Web3.providers
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
}

export default web3;

export const selectContractInstance = (contractBuild, address) => {
  return new Promise(res => {
    const myContract = contract(contractBuild);
    myContract.setProvider(provider);
    myContract
      .at(address)
      .then(instance => res(instance));
  })
}

export const mapReponseToJSON = (contractResponse, parameters, type) => {
  switch (type) {
    case 'arrayOfObject': {
      const result = [];
      contractResponse.forEach((paramValues, paramIndex) => {
        const paramName = parameters[paramIndex];
        paramValues.forEach((paramValue, itemIndex) => {
          const item = _.merge({}, _.get(result, [itemIndex], {}));
          if (typeof paramValue === 'string') {
            paramValue = web3.toUtf8(paramValue).trim();
          }
          item[paramName] = paramValue;
          result[itemIndex] = item;
        })
      });

      return result;
    }
    default:
      return contractResponse;
  }
}