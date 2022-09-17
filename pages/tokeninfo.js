import { useState } from "react";
import { useTokenInfo } from "../lib/hooks";

export default function TokenInfo() {
  const [chain, setChain] = useState("eth");
  const [address, setAddress] = useState(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  );
  const { token, error } = useTokenInfo(chain, address);

  if (error) {
    console.error(error);
  }

  const chainOpts = [
    { value: "eth", label: "Ethereum" },
    { value: "bsc", label: "Binance Smart Chain" },
    { value: "polygon", label: "Polygon" },
  ];

  return (
    <div className="w-full mx-auto sm:mt-20">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-6 space-y-4 bg-white rounded-md">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-700">Token Info</h1>
            <p className="text-sm text-gray-500">
              Get token info by chain and address
            </p>
          </div>
          <div className="flex items-center justify-center w-full space-x-2">
            <select
              className="w-1/2 text-gray-700  border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => setChain(e.target.value)}
            >
              {chainOpts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:border-gray-500"
              defaultValue={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="flex flex-col mx-auto items-center justify-center w-full max-w-md px-4 py-6 space-y-4 bg-white rounded-md">
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      )}
      {token && (
        // name, symbol, decimals, totalSupply
        <div className="w-full max-w-xs mx-auto">
          <div className="form-control">
            {/* <label className="label block uppercase text-center font-bold mb-4">
              Token Info
            </label> */}
            <span className="label label-text">Name</span>
            <input
              type="text"
              className="input input-bordered"
              value={token.name}
              readOnly
            />
            <span className="label label-text">Symbol</span>
            <input
              type="text"
              className="input input-bordered"
              value={token.symbol}
              readOnly
            />
            <span className="label label-text">Decimals</span>
            <input
              type="text"
              className="input input-bordered"
              value={token.decimals}
              readOnly
            />
            <span className="label label-text">Total Supply</span>
            <input
              type="text"
              className="input input-bordered"
              value={token.totalSupply}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}
