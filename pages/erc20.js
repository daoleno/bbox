import { useState, useEffect } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function ERC20() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Issue />
    </Web3ReactProvider>
  );
}

function Issue() {
  // stripe like tailwindcss form
  const [values, setValues] = useState({
    amount: "",
    address: "",
    memo: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, address, memo } = values;
    const amountNum = Number(amount);
    if (amountNum > 0) {
      setError(null);
      const data = {
        amount: amountNum,
        address,
        memo,
      };
      console.log(data);
    }
  };

  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = useWeb3React();

  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  // handle logic to recognize the connector currently being activated
  const [connecting, setConnnecting] = useState(false);

  // handle logic to recognize when the connector is connected
  const [connected, setConnected] = useState(false);

  return (
    <div className="w-full max-w-xs mx-auto">
      <form onSubmit={handleSubmit}>
        <label className="block uppercase text-gray-700 text-center font-bold mb-4">
          Issue ERC20 Token
        </label>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-name"
            >
              Token Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-memo"
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-amount"
            >
              Total Supply
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-amount"
              type="number"
              name="amount"
              placeholder="supply"
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-address"
            >
              Decimal
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-address"
              type="text"
              name="decimal"
              placeholder="decimal"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* connect wallet button place in center */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={() => {
              setConnnecting(true);
              activate(injected);
            }}
          >
            {connecting ? "Connecting Wallet ..." : "Connect Wallet"}
          </button>
        </div>
      </form>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
