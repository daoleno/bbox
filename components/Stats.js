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
  console.log("gasOracle", gasOracle);
  const usdc = price && price.USDC ? price.USDC : null;

  const txTime = defaultTxTime[chain];
  const { LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice } =
    gasOracle || {};
  const chainName = getChainOpts(chain).chainName;

  const stats = [
    {
      name: "🚶 Standard",
      stat: SafeGasPrice,
      time: txTime.standard,
      usd: calDefaultGasPrice(SafeGasPrice, usdc),
      color: "text-green-400",
    },
    {
      name: "🚗 Fast",
      stat: ProposeGasPrice,
      time: txTime.fast,
      usd: calDefaultGasPrice(ProposeGasPrice, usdc),
      color: "text-blue-400",
    },
    {
      name: "🚀 Rapid",
      stat: FastGasPrice,
      time: txTime.rapid,
      usd: calDefaultGasPrice(FastGasPrice, usdc),
      color: "text-red-400",
    },
  ];

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      <div className="mt-10">
        <div className="flex">
          <div className="flex-1">
            <ChainLogo chain={chain} />
          </div>
          <div
            className="group flex items-center text-base leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
            title="block height"
          >
            <span
              className="animate-ping w-2.5 h-2.5 mr-3 rounded-full bg-green-500"
              aria-hidden="true"
            />
            <span className="font-mono text-gray-500">{LastBlock}</span>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
          {stats.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-mono text-gray-900">{item.name}</dt>
              <dd className="mt-1 block justify-between items-baseline md:block lg:flex">
                <div
                  className={`flex items-baseline text-2xl  font-semibold ${item.color}`}
                >
                  {item.stat} GWei
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {item.usd}
                  </span>
                </div>

                <div className="bg-red-100 text-green-800 inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0">
                  {item.time}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
