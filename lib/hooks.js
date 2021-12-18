import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { toCorsHttp, getChainOpts } from "./web3";
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

const fetcher = async (url, opts) => {
  const res = await fetch(url, opts);

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
const scanFetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (data && data.status === "0") {
    throw new Error(data.message);
  }

  return data;
};
const tokenURIFetcher = async (chain, nftAddress, index) => {
  const nft = useERC721Contract(chain, nftAddress);
  const tokenURI = await nft.tokenURI(index);
  return tokenURI;
};
const uriFetcher = async (chain, nftAddress, index) => {
  const nft = useAdidasNFTContract(chain, nftAddress);
  const tokenURI = await nft.uri(index);
  return tokenURI;
};
const totalSupplyFetcher = async (chain, nftAddress) => {
  const nft = useERC721Contract(chain, nftAddress);
  const totalSupply = await nft.totalSupply();
  return totalSupply.toNumber();
};
const tokenSymbolFetcher = async (chain, address) => {
  const erc20 = useERC20Contract(chain, address);
  const symbol = await erc20.symbol();
  return symbol;
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
  const { data: uri, error: errURI } = useSWR(
    errToken && errToken.code === "CALL_EXCEPTION"
      ? [chain, nftAddress, index]
      : null,
    uriFetcher
  );
  const { data: nft, error: errNFT } = useSWR(
    tokenURI ? toCorsHttp(tokenURI) : uri ? toCorsHttp(uri) : null,
    fetcher
  );

  // if (errToken && errToken.message.toLowerCase().includes("token")) {
  if (errToken || errNFT) {
    return {
      nft: {
        tokenId: index,
        name: "Not Found",
        description: "Token is not existent",
        image: "/notfound.svg",
      },
      isLoading: false,
      error: errToken,
    };
  }

  return {
    nft,
    isLoading: !nft && (!errNFT || !errToken),
    error: errNFT,
  };
}

export function useERC721Contract(chain, nftAddress) {
  const contractAbi = require("../contracts/erc721/erc721abi.json");
  const { provider } = getChainOpts(chain);

  return new Contract(nftAddress, contractAbi, provider);
}

export function useAdidasNFTContract(chain, nftAddress) {
  const contractAbi = require("../contracts/erc721/adidasNFT.json");
  const { provider } = getChainOpts(chain);

  return new Contract(nftAddress, contractAbi, provider);
}

export function useERC20Contract(chain, address) {
  const contractAbi = require("../contracts/erc20/erc20abi.json");
  const { provider } = getChainOpts(chain);

  return new Contract(address, contractAbi, provider);
}

// fetch all transactions under the account's address from etherscan api with useSWR
export function useTxs(chain, address) {
  const { scanApiEndpoint, scanApiKey } = getChainOpts(chain);
  const { data, error } = useSWR(
    `${scanApiEndpoint}?module=account&action=txlist&address=${address}&sort=asc&apikey=${scanApiKey}`,
    scanFetcher,
    { revalidateOnFocus: false }
  );

  return {
    txs: data ? data.result : [],
    error,
  };
}

export function useGasOracle(chain) {
  const { scanApiEndpoint, scanApiKey } = getChainOpts(chain);
  const { data, error } = useSWR(
    `${scanApiEndpoint}?module=gastracker&action=gasoracle&apikey=${scanApiKey}`,
    scanFetcher,
    { refreshInterval: 1000 * 3 }
  );

  return {
    gasOracle: data ? data.result : null,
    error,
  };
}

export function useTokenSymbol(chain, address) {
  const { data: symbol, error } = useSWR([chain, address], tokenSymbolFetcher);
  return {
    symbol,
    error,
  };
}

export function useTokenPrice(symbol) {
  // get token price from coinbase api
  const { data, error } = useSWR(
    `https://api.coinbase.com/v2/exchange-rates?currency=${symbol}`,
    fetcher
  );
  if (data && data.data && data.data.rates) {
    return {
      price: data.data.rates,
      error,
    };
  }
  return {
    price: null,
    error,
  };
}

export function useTopNFTs() {
  const { data: auth, error: errAuth } = useSWR(
    `https://restapi.nftscan.com/gw/token?apiKey=${process.env.NEXT_PUBLIC_NFTSCAN_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_NFTSCAN_API_SECRET}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  const { data, error } = useSWR(
    auth
      ? [
          "https://restapi.nftscan.com/api/v1/getTopTrendingData",
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Token": auth.data.accessToken,
            },
            method: "POST",
            body: JSON.stringify({
              time: "1d",
            }),
          },
        ]
      : null,

    fetcher
  );
  return {
    topNFTs: data ? data.data : [],
    error: errAuth || error,
  };
}

const headFetcher = async (url) => {
  console.log("url", url);
  // head request for checking if the url is valid
  const res = await fetch(url, {
    method: "HEAD",
  });
  return res;
};

export function useContentType(url) {
  const { data, error } = useSWR(url, headFetcher, {
    revalidateOnFocus: false,
  });
  return {
    contentType: data ? data.headers.get("content-type") : null,
    error,
  };
}
