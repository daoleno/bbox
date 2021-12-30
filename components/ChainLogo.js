import { getChainOpts } from "../lib/web3";

export function ChainIcon({ chain }) {
  switch (chain) {
    case "eth":
      return (
        <img className="w-auto h-5" src="/logo/ethereum.svg" alt="Ethereum" />
      );
    case "polygon":
      return (
        <img className="w-auto h-5" src="/logo/polygon.svg" alt="Polygon" />
      );
    case "bsc":
      return (
        <img
          className="w-auto h-5"
          src="/logo/bsc.svg"
          alt="Binance Smart Chain"
        />
      );
    case "sol":
      return <img className="w-auto h-5" src="/logo/solana.svg" alt="Solana" />;
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
    case "sol":
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
