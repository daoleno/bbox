import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { toCorsHttp } from "./web3";
import useSWR from "swr";
import {
  getDefaultProvider,
  InfuraProvider,
  JsonRpcProvider,
} from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
const tokenURIFetcher = async (chain, nftAddress, index) => {
  const nft = useERC721Contract(chain, nftAddress);
  const tokenURI = await nft.tokenURI(index);
  return tokenURI;
};
const totalSupplyFetcher = async (chain, nftAddress) => {
  const nft = useERC721Contract(chain, nftAddress);
  const totalSupply = await nft.totalSupply();
  return totalSupply.toNumber();
};

export function useTotalSupply(chain, nftAddress) {
  const { data: totalSupply, error } = useSWR(
    [chain, nftAddress],
    totalSupplyFetcher
  );
  return {
    totalSupply,
    error,
  };
}

export function useNFT(chain, nftAddress, index) {
  const { data: tokenURI, error: errToken } = useSWR(
    [chain, nftAddress, index],
    tokenURIFetcher
  );
  const { data: nft, error: errNFT } = useSWR(
    tokenURI ? toCorsHttp(tokenURI) : null,
    fetcher
  );

  if (errToken && errToken.message.toLowerCase().includes("token")) {
    return {};
  }

  console.log(nft);

  return {
    nft,
    isLoading: !nft && (!errNFT || !errToken),
    error: errNFT,
  };
}

export function useERC721Contract(chain, nftAddress) {
  const contractAbi = require("../contracts/erc721/erc721abi.json");
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

  return new Contract(nftAddress, contractAbi, provider);
}
