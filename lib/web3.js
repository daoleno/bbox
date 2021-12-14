import { ContractFactory } from "@ethersproject/contracts";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { NFTStorage } from "nft.storage";
import {
  getDefaultProvider,
  InfuraProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import { Interface } from "@ethersproject/abi";

export function getProvider(chain) {
  let provider;
  switch (chain) {
    // https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/infura-provider.ts#L84
    case "eth":
      provider = new InfuraProvider(
        "homestead",
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );
      break;
    case "polygon":
      provider = new InfuraProvider(
        "matic",
        process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
      );
      break;
    case "bsc":
      provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
      break;
    default:
      provider = getDefaultProvider("mainnet");
  }
  return provider;
}

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

export function parseIPFSURI(uri) {
  const ipfsPrefix = "ipfs://";
  const ipfsPrefixInPath = "ipfs://ipfs/";

  if (uri.startsWith(ipfsPrefixInPath)) {
    return `https://ipfs.io/ipfs/${uri.substr(ipfsPrefixInPath.length)}`;
  }

  if (uri.startsWith(ipfsPrefix)) {
    return `https://ipfs.io/ipfs/${uri.substr(ipfsPrefix.length)}`;
  }

  return uri;
}

export function isVideo(uri) {
  if (!uri) {
    return false;
  }
  return uri.endsWith(".mp4");
}

export function toHttp(uri) {
  if (!uri) {
    return "";
  }
  if (uri.startsWith("http:") || uri.startsWith("https:")) {
    return uri;
  }
  return parseIPFSURI(uri);
}

export function toCorsHttp(uri) {
  if (uri.startsWith("http:") || uri.startsWith("https:")) {
    return `https://bbox-cors.herokuapp.com/${uri}`;
    // return `https://cors-anywhere.herokuapp.com/${uri}`;
  }
  return toHttp(uri);
}

// export async function fetchHTML(uri) {
//   try {
//     const response = await fetch(toCorsHttp(uri));
//     return await response.text();
//   } catch (error) {
//     throw error;
//   }
// }

// export function queryNFTInfo(html) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, "text/html");
//   return [...doc.querySelectorAll(".text-primary")].map((div) => ({
//     name: div.innerHTML,
//     href: div.href,
//   }));
// }

export function decodeApproveInput(data) {
  const erc20abi = require("../contracts/erc20/erc20abi.json");
  const iface = new Interface(erc20abi);
  let decodedInput;
  try {
    decodedInput = iface.decodeFunctionData("approve", data);
  } catch (error) {
    // ignore error
  }
  return decodedInput;
}
