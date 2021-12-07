import { useState, useEffect } from "react";
import { getErrorMessage, toHttp } from "../lib/web3";
import Notify from "../components/Notify";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/dist/client/router";
import tokensNFT from "../lib/tokensNFT";
import Link from "next/link";
import PopOver from "../components/Popover";
import { useNFT, useTotalSupply } from "../lib/hooks";

const emojis = [
  "🔥",
  "⚡️",
  "✨",
  "❤️",
  "🏆",
  "🎉",
  "💰",
  "💵",
  "💸",
  "⏱",
  "⏰",
  "🚚",
  "💪",
  "🔑",
  "🗝",
  "🥇",
  "👀",
  "🎯",
  "💣",
  "🎁",
  "🎈",
  "⏳",
  "👏",
  "📣",
  "⭐️",
  "💡",
  "🛍",
  "🎟",
  "🥳",
  "😍",
  "🥰",
  "😎",
  "😂",
  "🤗",
];

export default function NFTGallery() {
  const { query, replace } = useRouter();
  const { search } = query;
  const [error, setError] = useState();
  const { totalSupply, error: totalSupplyError } = useTotalSupply(search);
  const [fetchIndex, setFetchIndex] = useState(0);

  async function handleFetch(e) {
    e.preventDefault();
    replace(`/nftgallery?search=${searchVaule}`);
  }

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      <div className="flex flex-col">
        <form
          className="relative z-0 flex-1 px-2 py-4 flex items-center justify-center"
          onSubmit={handleFetch}
        >
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
                placeholder="NFT Contract Address"
                type="search"
                onInput={(e) => setSearchVaule(e.target.value)}
              />
              {/* get random emojis */}
              <div className="text-center my-auto pl-3 text-3xl">
                <Link
                  href={`/nftgallery?search=${
                    tokensNFT[Math.floor(Math.random() * tokensNFT.length)]
                      .address
                  }`}
                >
                  {emojis[Math.floor(Math.random() * emojis.length)]}
                </Link>
              </div>
            </div>
          </div>
        </form>
        {!search && (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 mt-8 overflow-y-auto h-screen"
          >
            {tokensNFT.map((nft) => (
              <li
                key={`/nftgallery?search=${nft.address}`}
                className="relative"
              >
                <a
                  title={nft.address}
                  href={`/nftgallery?search=${nft.address}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {nft.name}
                </a>
              </li>
            ))}
          </ul>
        )}
        {/* Loading Spinner */}
        {/* {nfts.length == 0 && search && (
          <div className="flex justify-center items-center mt-48">
            <img
              src="rocket.png"
              className="animate-bounce h-32 w-32"
              alt="loading"
            />
          </div>
        )} */}
        {search && <NFTCardPage address={search} index={fetchIndex} />}
        {
          <div className="flex justify-center items-center">
            <button
              type="button"
              className="inline-flex items-center mt-10 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => {
                e.preventDefault();
                setFetchIndex(fetchIndex + 8);
              }}
            >
              {`${totalSupply - fetchIndex}/${totalSupply}`}
            </button>
          </div>
        }
      </div>
    </>
  );
}

function NFTCardPage({ address, index = 0 }) {
  console.log("fetchindex", index);
  const pageLimit = 8;
  const nfts = [];
  for (let i = index; i < index + pageLimit; i++) {
    nfts.push(
      <li key={i} className="relative">
        <NFTCard address={address} index={i} />
      </li>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {nfts}
    </ul>
  );
}

function NFTCard({ address, index }) {
  const { nft, error } = useNFT(address, index);

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      {nft && (
        <>
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <img
              src={toHttp(nft.image)}
              alt={nft.name}
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
            <button type="button" className="absolute">
              <span className="sr-only">View details for {nft.name}</span>
            </button>
          </div>
          <div className="flex justify-around mt-2 text-sm font-medium text-gray-900">
            <a href={toHttp(nft.image)} target="_blank">
              {nft.name}
            </a>
            <PopOver info={nft} />
          </div>
        </>
      )}
    </>
  );
}
