import { ContractFactory } from "@ethersproject/contracts";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { NFTStorage } from "nft.storage";
import {
  InfuraProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import { Interface } from "@ethersproject/abi";

export function getChainOpts(chain) {
  switch (chain) {
    // https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/infura-provider.ts#L84
    case "eth":
      return {
        chainName: "Ethereum",
        tokenSymbol: "ETH",
        provider: new InfuraProvider(
          "homestead",
          process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
        ),
        scanEndpoint: "https://etherscan.io/",
        scanApiEndpoint: "https://api.etherscan.io/api",
        scanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
      };
    case "polygon":
      return {
        chainName: "Polygon",
        tokenSymbol: "MATIC",
        provider: new InfuraProvider(
          "matic",
          process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
        ),
        scanEndpoint: "https://polygonscan.com/",
        scanApiEndpoint: "https://api.polygonscan.com/api",
        scanApiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
      };
    case "bsc":
      return {
        chainName: "Binance Smart Chain",
        tokenSymbol: "BNB",
        provider: new JsonRpcProvider("https://bsc-dataseed.binance.org/"),
        scanEndpoint: "https://bscscan.com/",
        scanApiEndpoint: "https://api.bscscan.com/api",
        scanApiKey: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY,
      };
    case "sol":
      return {
        chainName: "Solana",
        tokenSymbol: "SOL",
        // provider: new JsonRpcProvider("https://api.solana.com"),
        // scanEndpoint: "https://solanascan.com/",
        // scanApiEndpoint: "https://api.solanascan.com/api",
        // scanApiKey: process.env.NEXT_PUBLIC_SOLANASCAN_API_KEY,
      };
    default:
      return {};
  }
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

const supportedSuffix = [".jpg", ".png", ".jpeg", ".gif", ".mp4"];

export function hasSupportedSuffix(uri) {
  if (!uri) {
    return false;
  }
  return supportedSuffix.some((suffix) => uri.endsWith(suffix));
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

export function calDefaultGasPrice(gasPrice, ethPriceInUSD) {
  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 4, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  const p = gasPrice * 1e-9 * ethPriceInUSD * 21000;
  return formatter.format(p);
}

export const defaultTxTime = {
  eth: {
    standard: "~10 mins",
    fast: "~3 mins",
    rapid: "~30 secs",
  },
  polygon: {
    standard: "30-60 secs",
    fast: "10-30 secs",
    rapid: "5-10 secs",
  },
  bsc: {
    standard: "30-60 secs",
    fast: "10-30 secs",
    rapid: "5-10 secs",
  },
};

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
