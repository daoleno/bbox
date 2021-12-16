import { getChainOpts } from "../lib/web3";

export function ChainIcon({ chain }) {
  switch (chain) {
    case "eth":
      return (
        <img className="w-auto h-5" src="/ethereum-logo.svg" alt="Ethereum" />
      );
    case "polygon":
      return (
        <img className="w-auto h-5" src="/polygon-logo.svg" alt="Polygon" />
      );
    case "bsc":
      return (
        <img
          className="w-auto h-5"
          src="/bsc-logo.svg"
          alt="Binance Smart Chain"
        />
      );
  }
}

export default function ChainLogo({ chain }) {
  const { chainName } = getChainOpts(chain);
  switch (chain) {
    case "eth":
      return (
        <div className="flex">
          <ChainIcon chain={chain} />
          <span className="mx-2 ml-2 text-sm text-gray-600 font-mono">
            {chainName}
          </span>
        </div>
      );
    case "polygon":
      return (
        <div className="flex">
          <ChainIcon chain={chain} />
          <span className="mx-2 ml-2 text-sm text-gray-600 font-mono">
            {chainName}
          </span>
        </div>
      );
    case "bsc":
      return (
        <div className="flex items-center">
          <ChainIcon chain={chain} />
          <span className="mx-2 ml-2 text-sm text-gray-600 font-mono">
            {chainName}
          </span>
        </div>
      );
  }
}
