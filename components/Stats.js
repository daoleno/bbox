/* This example requires Tailwind CSS v2.0+ */
import ChainLogo from "./ChainLogo";
import { useGasOracle, useTokenPrice } from "../lib/hooks";
import {
  calDefaultGasPrice,
  getChainOpts,
  defaultTxTime,
  getErrorMessage,
} from "../lib/web3";
import Notify from "./Notify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Stats({ chain }) {
  const { gasOracle, error } = useGasOracle(chain);
  const { tokenSymbol } = getChainOpts(chain);
  const { price, priceError } = useTokenPrice(tokenSymbol);
  const usdc = price && price.USDC ? price.USDC : null;

  const txTime = defaultTxTime[chain];
  const { LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice } =
    gasOracle || {};
  const chainName = getChainOpts(chain).chainName;

  const stats = [
    {
      name: "Standard",
      stat: SafeGasPrice,
      time: txTime.standard,
      icon: "🚶",
      usd: calDefaultGasPrice(SafeGasPrice, usdc),
      color: "text-primary",
    },
    {
      name: "Fast",
      stat: ProposeGasPrice,
      time: txTime.fast,
      icon: "🚗",
      usd: calDefaultGasPrice(ProposeGasPrice, usdc),
      color: "text-accent",
    },
    {
      name: "Rapid",
      stat: FastGasPrice,
      time: txTime.rapid,
      icon: "🚀",
      usd: calDefaultGasPrice(FastGasPrice, usdc),
      color: "text-secondary",
    },
  ];

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      <div className="mt-10">
        <div className="flex">
          <div className="flex-1 label">
            <ChainLogo chain={chain} />
          </div>
          <div
            className="label group flex items-center text-base leading-5 font-medium rounded-md"
            title="block height"
          >
            <span
              className="animate-ping w-2.5 h-2.5 mr-3 rounded-full bg-primary"
              aria-hidden="true"
            />
            <span className="label-text">{LastBlock}</span>
          </div>
        </div>
        <div className="w-full shadow stats mt-5">
          {stats.map((item) => (
            <div className="stat">
              <div className="stat-figure text-info ml-3 md:ml-0">
                {item.icon}
              </div>
              <div className="stat-title">{item.name}</div>
              <div className={`stat-value ${item.color}`}>{item.stat} GWei</div>
              <div className="stat-desc">{item.usd}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
