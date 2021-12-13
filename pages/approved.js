import ChainLogo from "../components/ChainLogo";
import { SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { getProvider, getErrorMessage } from "../lib/web3";
import { useRouter } from "next/router";
import { useTxs, useApprovedTx } from "../lib/hooks";
import Notify from "../components/Notify";

const etherscanTxUrl = "https://etherscan.io/tx/";
const etherscanAddressUrl = "https://etherscan.io/address/";

export default function Approved() {
  const { query, replace, isReady } = useRouter();
  const { search } = query;
  const [address, setAddress] = useState(search);
  const { txs, isLoading, error } = useTxs(search);

  function handleFetch(e) {
    e.preventDefault();
    replace(`?search=${address}`);
  }

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      <form
        className="relative z-0 flex-1 px-2 py-4 flex flex-wrap items-center justify-center"
        onSubmit={handleFetch}
      >
        <ChainLogo chain="eth" />
        <div className="max-w-xs w-full">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative flex flex-row">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <SearchIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              name="search"
              id="search"
              className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              placeholder="address"
              type="search"
              onInput={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Transaction
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                {txs && <TxItems txs={txs} owner={search} />}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TxItems({ txs, owner }) {
  const provider = getProvider("eth");
  const txitems = [];
  for (let i = 0; i < txs.length; i++) {
    txitems.push(
      <TxItem
        provider={provider}
        txHash={txs[i].hash}
        timestamp={txs[i].timeStamp}
        txIdx={i}
        owner={owner}
        key={i}
      />
    );
  }

  return <tbody>{txitems}</tbody>;
}

function TxItem({ provider, txHash, timestamp, txIdx, owner }) {
  const { data: tx, error } = useApprovedTx(provider, txHash, owner);
  if (error) {
    return <Notify error={getErrorMessage(error)} />;
  }
  if (tx && tx.decode && tx.decode.length > 0) {
    console.log("tx", tx, "txHash", txHash, "length", tx.decode.length);

    const items = tx.decode.map((log, i) => (
      <LogItem tx={tx} txIdx={txIdx} log={log} key={i} timestamp={timestamp} />
    ));
    return <>{items}</>;
  }

  return <></>;
}

function LogItem({ tx, txIdx, log, timestamp }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400 hover:text-blue-600">
        <a href={etherscanTxUrl + tx.transactionHash} target="_blank">
          {tx.transactionHash.substring(0, 18) + "..."}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 hover:text-blue-600">
        <a href={etherscanAddressUrl + log.decode.spender} target="_blank">
          {log.decode.spender}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {/* if bigint value larger than 2^256-1, show unlimited */}
        {log.decode.value > BigInt(0xffffffffffffffffffffffffffffffff)
          ? "unlimited"
          : log.decode.value.toString()}{" "}
        <a
          href={etherscanAddressUrl + log.address}
          target="_blank"
          className="text-blue-400 hover:text-blue-600"
        >
          {log.address}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {/* show humanable date from timestamp */}
        {timestamp ? new Date(timestamp * 1000).toLocaleString() : ""}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Revoke
        </a>
      </td>
    </tr>
  );
}
