import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import {
  toCorsHttp,
  getProvider,
  getScanAPIEndpoint,
  getScanAPIKey,
} from "./web3";
import useSWR from "swr";
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
  const provider = getProvider(chain);

  return new Contract(nftAddress, contractAbi, provider);
}

export function useERC20Contract(chain, address) {
  const contractAbi = require("../contracts/erc20/erc20abi.json");
  const provider = getProvider(chain);

  return new Contract(address, contractAbi, provider);
}

// fetch all transactions under the account's address from etherscan api with useSWR
export function useTxs(chain, address) {
  const { data, error } = useSWR(
    `${getScanAPIEndpoint(
      chain
    )}/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${getScanAPIKey(
      chain
    )}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  if (data && data.status === "0") {
    return {
      txs: [],
      error: data.message,
    };
  }

  return {
    txs: data ? data.result : [],
    error,
  };
}

const tokenSymbolFetcher = async (chain, address) => {
  const erc20 = useERC20Contract(chain, address);
  const symbol = await erc20.symbol();
  return symbol;
};

export function useTokenSymbol(chain, address) {
  const { data: symbol, error } = useSWR([chain, address], tokenSymbolFetcher);
  return {
    symbol,
    error,
  };
}
