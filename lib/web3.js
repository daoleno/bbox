import { Web3Provider } from "@ethersproject/providers";
import { ContractFactory } from "@ethersproject/contracts";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";

export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    // return "An unknown error occurred. Check the console for more details.";
    return error.message;
  }
}

export async function deployERC20(singer, { name, symbol, decimals, supply }) {
  const contractAbi = require("../contracts/erc20/erc20abi.json");
  const contractBytecode = require("../contracts/erc20/erc20bin.json").object;

  const factory = new ContractFactory(contractAbi, contractBytecode, singer);
  // deploy the contract
  const contract = await factory.deploy(
    name,
    symbol,
    BigNumber.from(decimals),
    BigNumber.from(supply)
  );

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);
  await contract.deployed();

  // Done! The contract is deployed.
}
