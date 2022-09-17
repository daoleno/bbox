import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { injected } from "./connectors";
import { getChainOpts, toCorsHttp } from "./web3";

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

const tokenInfoFetcher = async (chain, address) => {
  const erc20 = useERC20Contract(chain, address);
  const [name, symbol, decimals, totalSupply] = await Promise.allSettled([
    erc20.name(),
    erc20.symbol(),
    erc20.decimals(),
    erc20.totalSupply(),
  ]);

  // if all promises are rejected, throw error
  if (symbol.status === "rejected") {
    throw new Error("Invalid ERC20 token address");
  }

  return {
    name: name.status === "fulfilled" ? name.value : "--",
    symbol: symbol.status === "fulfilled" ? symbol.value : "--",
    decimals: decimals.status === "fulfilled" ? decimals.value : 0,
    totalSupply: totalSupply.status === "fulfilled" ? totalSupply.value : 0,
  };
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
    chain != "sol" ? [chain, nftAddress, index] : null,
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
        image: "/notfound.png",
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

export function useTopNFTs(chain) {
  const { data: auth, error: errAuth } = useSWR(
    chain == "eth"
      ? `https://restapi.nftscan.com/gw/token?apiKey=${process.env.NEXT_PUBLIC_NFTSCAN_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_NFTSCAN_API_SECRET}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const { data: ethData, error: errorEth } = useSWR(
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

  const { data: solData, error: errorSol } = useSWR(
    chain == "sol" ? `https://api.solscan.io/collection?sortBy=volume` : null,
    fetcher
  );

  const data = ethData || solData;
  const error = errorEth && errorSol;

  return {
    topNFTs: data ? data.data : [],
    error: errAuth || error,
  };
}

export function useContentType(url) {
  const { data, error } = useSWR(url, headFetcher, {
    revalidateOnFocus: false,
  });
  return {
    contentType: data ? data.headers.get("content-type") : null,
    error,
  };
}

export function useSolNFTCollection(chain, colletionId, offset, limit) {
  const api = `https://api.solscan.io/collection/nft?sortBy=name&collectionId=${colletionId}&offset=${offset}&limit=${limit}`;
  const { data, error } = useSWR(chain == "sol" ? api : null, fetcher, {
    revalidateOnFocus: false,
  });
  return {
    nfts: data ? data.data : [],
    error,
  };
}

export function useSolNFT(tokenURI) {
  const { data: nft, error } = useSWR(
    tokenURI ? toCorsHttp(tokenURI) : null,
    fetcher
  );

  // if (errToken && errToken.message.toLowerCase().includes("token")) {
  if (error) {
    return {
      nft: {
        name: "Not Found",
        description: "Token is not existent",
        image: "/notfound.png",
      },
      isLoading: false,
      error: error,
    };
  }

  return {
    nft,
    isLoading: !nft && !error,
    error: error,
  };
}

export function useTokenInfo(chain, address) {
  const { data: token, error } = useSWR([chain, address], tokenInfoFetcher);
  return {
    token,
    error,
  };
}
