import ChainLogo from "../components/ChainLogo";
import { SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useState } from "react";
import { getProvider } from "../lib/web3";
import useSWR from "swr";
import { useRouter } from "next/dist/client/router";
import { useEventLogs } from "../lib/hooks";

// const transactions = [
//   {
//     hash: "0x1e80793a...fe39b",
//     to: "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
//     amount: "100000",
//     date: "Dec-12-2021 06:57:53 AM +UTC",
//   },
//   {
//     hash: "0x1e80793a...8fe39b",
//     to: "0xa0c68c638235ee32657e8f720a23cec1bfc77c77",
//     amount: "32432",
//     date: "Dec-12-2021 06:57:53 AM +UTC",
//   },
// ];

export default function Approved() {
  const { query, replace, isReady } = useRouter();
  const { search } = query;
  const [address, setAddress] = useState(search);
  const { eventLogs, isLoading, error } = useEventLogs(search, "Approval");
  console.log("approveTxs", eventLogs);
  console.log("isLoading", isLoading);

  function handleFetch(e) {
    e.preventDefault();
    replace(`?search=${address}`);
  }

  return (
    <>
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
                <tbody>
                  {eventLogs &&
                    eventLogs.map((tx, txIdx) => (
                      <tr
                        key={tx.transactionHash}
                        className={txIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.transactionHash}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.decode.spender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.blockNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Revoke
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
