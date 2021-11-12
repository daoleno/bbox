import { useState, useEffect } from "react";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
import { ContractFactory } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { XCircleIcon } from "@heroicons/react/solid";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function Error({ error }) {
  return (
    <div className="rounded-md bg-red-50 p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorMessage(error)}
          </h3>
          {/* <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc pl-5 space-y-1">
              <li>Your password must be at least 8 characters</li>
              <li>Your password must include at least one pro wrestling finishing move</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    // return "An unknown error occurred. Check the console for more details.";
    return error.message;
  }
}

export default function ERC20() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Issue />
    </Web3ReactProvider>
  );
}

async function DeployERC20(library, { name, symbol, decimals, supply }) {
  // load the contract from contracts/erc20/erc20.abi
  // read in the contracts
  const contractAbi = require("../contracts/erc20/erc20abi.json");
  const contractBytecode = require("../contracts/erc20/erc20bin.json").object;

  const singer = library.getSigner();
  const factory = new ContractFactory(contractAbi, contractBytecode, singer);
  // deploy the contract
  const contract = await factory.deploy(
    name,
    symbol,
    BigNumber.from(decimals),
    BigNumber.from(supply)
  );

  console.log(contract.address);
  console.log(contract.deployTransaction.hash);
  await contract.deployed();

  // Done! The contract is deployed.
}

function Issue() {
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: 0,
    supply: 0,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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
  const [activating, setActivating] = useState(false);

  const handleIssue = (event) => {
    event.preventDefault();
    // deploy erc20

    DeployERC20(library, { ...values });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
  };

  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  useEffect(() => {
    if (active) {
      setActivating(false);
    }
  });
  const [err, setErr] = useState(null);

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      {err && <Error error={err} />}
      <form onSubmit={handleSubmit}>
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
          {active ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={handleIssue}
            >
              Issue
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                setActivating(true);
                activate(injected, (err) => setErr(err));
              }}
            >
              {activating ? "Connecting Wallet ..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </form>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
