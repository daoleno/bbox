import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { toCorsHttp } from "./web3";
import useSWR from "swr";
import { InfuraProvider } from "@ethersproject/providers";
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

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const tokenURIFetcher = async (nftAddress, index) => {
  const nft = useERC721Contract(nftAddress);
  const tokenURI = await nft.tokenURI(index);
  return tokenURI;
};
const totalSupplyFetcher = async (nftAddress) => {
  const nft = useERC721Contract(nftAddress);
  const totalSupply = await nft.totalSupply();
  return totalSupply.toNumber();
};

export function useTotalSupply(nftAddress) {
  const { data: totalSupply, error } = useSWR(nftAddress, totalSupplyFetcher);
  return {
    totalSupply,
    error,
  };
}

export function useNFT(nftAddress, index) {
  const { data: tokenURI, error: errToken } = useSWR(
    [nftAddress, index],
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
    error: errNFT || errToken,
  };
}

export function useERC721Contract(nftAddress) {
  const contractAbi = require("../contracts/erc721/erc721abi.json");
  const provider = new InfuraProvider(
    "homestead",
    process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  );

  return new Contract(nftAddress, contractAbi, provider);
}
