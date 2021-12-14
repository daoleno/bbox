import ChainLogo from "./ChainLogo";
import { SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import {
  decodeApproveInput,
  getErrorMessage,
  getScanAddressUrl,
  getScanTxUrl,
} from "../lib/web3";
import { useRouter } from "next/router";
import { useTxs, useTokenSymbol } from "../lib/hooks";
// import Notify from "./Notify";

export default function Approved({ chain }) {
  const { query, replace } = useRouter();
  const { search } = query;
  const [address, setAddress] = useState(search);
  const { txs, error } = useTxs(chain, search);

  function handleFetch(e) {
    e.preventDefault();
    replace(`?search=${address}`);
  }

  return (
    <>
      {/* {error && <Notify error={getErrorMessage(error)} />} */}
      <form
        className="relative z-0 flex-1 px-2 py-4 flex flex-wrap items-center justify-center"
        onSubmit={handleFetch}
      >
        <ChainLogo chain={chain} href={`/approved/${chain}`} />
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
              placeholder="Address"
              type="search"
              onInput={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </form>
      {txs.length == 0 && !search && (
        /* This example requires Tailwind CSS v2.0+ */
        <div className="sm:rounded-lg flex flex-col">
          <img src="/Wallet_Isometric.svg" alt="approve" className="mx-auto" />
          <div className="px-4 py-5 sm:p-6  text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 ">
              Revoke Token Approvals
            </h3>
            <div className="mt-2 text-sm text-gray-500 sm:text-center">
              <p>Review and revoke your token approvals for any dApp.</p>
            </div>
          </div>
        </div>
      )}

      {/* loading */}
      {txs.length == 0 && search && (
        <div className="flex justify-center items-center mt-48">
          <img
            src="/rocket.png"
            className="animate-bounce h-32 w-32"
            alt="loading"
          />
        </div>
      )}

      {txs.length > 0 && (
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
                        Spender
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
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {txs && <TxItems chain={chain} txs={txs} />}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TxItems({ chain, txs }) {
  const txitems = txs
    .sort((x, y) => y.timeStamp - x.timeStamp)
    .map((tx, i) => <TxItem chain={chain} tx={tx} key={i} />);
  return <tbody className="bg-white divide-y divide-gray-200">{txitems}</tbody>;
}

function TxItem({ chain, tx }) {
  const decodedInput = decodeApproveInput(tx.input);
  const { symbol, error } = useTokenSymbol(chain, tx.to);
  const addressUrl = getScanAddressUrl(chain);
  const txUrl = getScanTxUrl(chain);

  return (
    <>
      {!error && decodedInput && (
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400 hover:text-blue-600">
            <a href={txUrl + tx.hash} target="_blank" title={tx.hash}>
              {tx.hash.substring(0, 18) + "..."}
            </a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 hover:text-blue-600">
            <a href={addressUrl + decodedInput.spender} target="_blank">
              {decodedInput.spender}
            </a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {/* if bigint value larger than 2^256-1, show unlimited */}
            {decodedInput.amount > BigInt(0xffffffffffffffffffffffffffffffff)
              ? "unlimited"
              : decodedInput.amount.toString()}{" "}
            <a
              href={addressUrl + tx.to}
              target="_blank"
              className="text-blue-400 hover:text-blue-600"
              title={tx.to}
            >
              {symbol}
            </a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {tx.timeStamp ? new Date(tx.timeStamp * 1000).toLocaleString() : ""}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a
              href={addressUrl + tx.to + "#writeContract"}
              className="text-indigo-600 hover:text-indigo-900"
              target="_blank"
              title="appove spender 0 amount to revoke approval"
            >
              Revoke
            </a>
          </td>
        </tr>
      )}
    </>
  );
}
