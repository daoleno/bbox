import { getDefaultProvider, Web3Provider } from "@ethersproject/providers";
import { Contract, ContractFactory } from "@ethersproject/contracts";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { NFTStorage } from "nft.storage";

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
  try {
    const contract = await factory.deploy(
      name,
      symbol,
      BigNumber.from(decimals),
      BigNumber.from(supply)
    );
    await contract.deployed();
  } catch (error) {
    throw error;
  }
}

export async function deployERC721(singer, { name, symbol }) {
  const contractAbi = require("../contracts/erc721/erc721abi.json");
  const contractBytecode = require("../contracts/erc721/erc721bin.json").object;

  const factory = new ContractFactory(contractAbi, contractBytecode, singer);
  try {
    const contract = await factory.deploy(name, symbol);
    await contract.deployed();
  } catch (error) {
    throw error;
  }
}

export async function uploadToNFTStorage({ name, description }, file) {
  // upload file to nft.storage
  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFTStorage_API_KEY,
  });

  try {
    const metadata = await client.store({
      name: name,
      description: description,
      image: file,
    });
    return metadata.url;
  } catch (error) {
    throw error;
  }
}

export async function fetchNFT() {
  const contractAbi = require("../contracts/erc721/erc721abi.json");
  const contractBytecode = require("../contracts/erc721/erc721bin.json").object;
  const provider = getDefaultProvider("rinkeby");

  const contract = new Contract();
}
