import ChainLogo from "./ChainLogo";
import { SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { decodeApproveInput, getChainOpts, getErrorMessage } from "../lib/web3";
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
        <a href={`/approved/${chain}`} className="label">
          <ChainLogo chain={chain} />
        </a>
        <div className="relative flex flex-row">
          <div className="relative">
            <input
              type="text"
              placeholder="Address"
              className="w-full pr-16 input input-primary input-bordered"
              onInput={(e) => setAddress(e.target.value)}
            />
            <button
              className="absolute top-0 right-0 rounded-l-none btn btn-primary"
              onClick={handleFetch}
            >
              go
            </button>
          </div>
        </div>
      </form>
      {txs.length == 0 && !search && (
        /* This example requires Tailwind CSS v2.0+ */
        <div className="sm:rounded-lg flex flex-col">
          <img src="/wallet.svg" alt="approve" className="mx-auto" />
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium">
              Revoke Token Approvals
            </h3>
            <div className="mt-2 text-sm sm:text-center">
              <p>Review and revoke your token approvals for any dApp.</p>
            </div>
          </div>
        </div>
      )}

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
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Spender</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            {txs && <TxItems chain={chain} txs={txs} />}
          </table>
        </div>
      )}
    </>
  );
}

function TxItems({ chain, txs }) {
  const txitems = txs
    .sort((x, y) => y.timeStamp - x.timeStamp)
    .map((tx, i) => <TxItem chain={chain} tx={tx} key={i} />);
  return <tbody>{txitems}</tbody>;
}

function TxItem({ chain, tx }) {
  const decodedInput = decodeApproveInput(tx.input);
  const { symbol, error } = useTokenSymbol(chain, tx.to);
  const { scanEndpoint } = getChainOpts(chain);
  const addressUrl = `${scanEndpoint}/address/`;
  const txUrl = `${scanEndpoint}/tx/`;

  return (
    <>
      {!error && decodedInput && (
        <tr>
          <td>
            <a
              href={txUrl + tx.hash}
              target="_blank"
              title={tx.hash}
              className="link link-hover"
            >
              {tx.hash.substring(0, 18) + "..."}
            </a>
          </td>
          <td>
            <a
              href={addressUrl + decodedInput.spender}
              target="_blank"
              className="link link-hover"
            >
              {decodedInput.spender}
            </a>
          </td>
          <td>
            {/* if bigint value larger than 2^256-1, show unlimited */}
            {decodedInput.amount > BigInt(0xffffffffffffffffffffffffffffffff)
              ? "unlimited"
              : decodedInput.amount.toString()}{" "}
            <a
              href={addressUrl + tx.to}
              target="_blank"
              className="badge badge-info"
              title={tx.to}
            >
              {symbol}
            </a>
          </td>
          <td>
            {tx.timeStamp ? new Date(tx.timeStamp * 1000).toLocaleString() : ""}
          </td>
          <td>
            <a
              href={addressUrl + tx.to + "#writeContract"}
              className="badge badge-accent"
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
