import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { toCorsHttp, getProvider } from "./web3";
import useSWR from "swr";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";

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

// fetch all transactions under the account's address from etherscan api with useSWR
export function useTxs(address) {
  const { data, error } = useSWR(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    fetcher
  );
  if (data && data.status === "0") {
    return {
      error: data.message,
    };
  }

  return {
    txs: data ? data.result : [],
    isLoading: !data && !error,
    error,
  };
}

const txReceiptFetcher = async (provider, txHash) => {
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt;
};

export function useTxReceipt(provider, txHash) {
  const { data, error } = useSWR([provider, txHash], txReceiptFetcher);
  return {
    data,
    error,
  };
}

// fetch all tx receipt by provider
export function useTxReceipts(provider, txs) {
  // const txReceipts = txs.map((tx) => {
  //   useSWR([provider, tx.hash], txReceiptFetcher);
  // });
  // return txReceipts;
  const txReceipts = txs.map((tx) => {
    const { data, error } = useSWR([provider, tx.hash], txReceiptFetcher);
    return {
      data,
      error,
    };
  });
  return txReceipts;
}

export async function useEventLogs(address, eventName) {
  const erc20abi = require("../contracts/erc20/erc20abi.json");
  const iface = new Interface(erc20abi);
  const { txs, isLoading, error } = useTxs(address);

  const txReceipts = useTxReceipts(getProvider("eth"), txs);
  console.log("txReceipts", txReceipts);
  // filter txs by event name and decodeEventLog
  const eventLogs = txReceipts
    .map((receipt) => {
      return receipt.logs
        .map((log) => {
          try {
            const decode = iface.decodeEventLog(
              eventName,
              log.data,
              log.topics
            );
            return {
              ...log,
              decode,
            };
          } catch (e) {
            // console.log("error", e);
          }
        })
        .filter((log) => log);
    })
    .filter((logs) => logs.length > 0)
    .flat();

  console.log("eventLogs", eventLogs);

  return {
    eventLogs,
    isLoading: isLoading || !txs,
    error,
  };
}
