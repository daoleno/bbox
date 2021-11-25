import { useState } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { getErrorMessage, getLibrary, deployERC20 } from "../lib/web3";
import Notify from "../components/Notify";
import { injected } from "../lib/connectors";
import { useEagerConnect } from "../lib/hooks";

export default function ERC20() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Issue />
    </Web3ReactProvider>
  );
}

function Issue() {
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: 0,
    supply: 0,
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const { library, activate, active, error, setError } = useWeb3React();
  const [activating, setActivating] = useState(false);
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  async function handleIssue(e) {
    e.preventDefault();
    if (active) {
      try {
        await deployERC20(library.getSigner(), { ...values });
      } catch (e) {
        setError(e);
      }
    } else {
      setActivating(true);
      activate(injected);
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto sm:mt-20">
      {error && (
        <Notify key={new Date().getTime()} error={getErrorMessage(error)} />
      )}
      <form>
        <label className="block uppercase text-gray-700 text-center font-bold mb-4">
          Issue ERC20 Token
        </label>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
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
              htmlFor="symbol"
            >
              Token Symbol
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-memo"
              type="text"
              name="symbol"
              placeholder="symbol"
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="supply"
            >
              Total Supply
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-amount"
              type="number"
              name="supply"
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
              type="number"
              name="decimal"
              placeholder="decimal"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleIssue}
          >
            {active
              ? "Issue"
              : activating && !error
              ? "Connecting Wallet ..."
              : "Connect Wallet"}
          </button>
        </div>
      </form>
    </div>
  );
}
