import { useState, useEffect } from "react";
import { getErrorMessage, isVideo, toHttp } from "../lib/web3";
import Notify from "../components/Notify";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/dist/client/router";
import tokensNFT from "../lib/tokensNFT";
import Link from "next/link";
import PopOver from "../components/Popover";
import { useNFT, useTotalSupply } from "../lib/hooks";
import Pagination from "../components/Pagination";

const onePageNumber = 8;
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
  const { query, replace, isReady } = useRouter();
  const { search, token_id } = query;
  const { totalSupply, error: totalSupplyError } = useTotalSupply(search);
  const [fetchIndex, setFetchIndex] = useState(0);

  function handleFetch(e) {
    e.preventDefault();
    replace(`/nftgallery?search=${searchVaule}`);
  }

  useEffect(() => {
    setFetchIndex(+token_id || 0);
    if (fetchIndex > totalSupply) {
      setFetchIndex(totalSupply);
    }
  }, [token_id]);

  return (
    <>
      {/* {error && <Notify error={getErrorMessage(error)} />} */}
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
        {!isReady && (
          <div className="flex justify-center items-center mt-48">
            <img
              src="rocket.png"
              className="animate-bounce h-32 w-32"
              alt="loading"
            />
          </div>
        )}
        {search && (
          <>
            <div className="hidden">
              <NFTCardPage
                address={search}
                index={fetchIndex + onePageNumber}
              />
            </div>
            <NFTCardPage address={search} index={fetchIndex} />
          </>
        )}
        <Pagination
          searchValue={search}
          fetchIndex={fetchIndex}
          totalSupply={totalSupply}
          setFetchIndex={setFetchIndex}
        />
      </div>
    </>
  );
}

function NFTCardPage({ address, index }) {
  const pageLimit = index + onePageNumber;
  const nfts = [];
  for (let i = index; i < pageLimit; i++) {
    nfts.push(
      <li key={i} className="relative">
        <NFTCard address={address} index={i} />
      </li>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 mt-5"
    >
      {nfts}
    </ul>
  );
}

function NFTCard({ address, index }) {
  const { nft, isLoading, error } = useNFT(address, index);
  if (isLoading)
    return (
      <>
        <button className="animate-pulse group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"></button>
        <div className="flex justify-around mt-2 text-sm font-medium text-gray-900">
          ...
        </div>
      </>
    );

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      {nft && (
        <>
          <button className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            {isVideo(nft.image) ? (
              <video
                className="object-cover pointer-events-none group-hover:opacity-75"
                src={toHttp(nft.image)}
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                src={toHttp(nft.image)}
                alt={nft.name}
                className="object-cover pointer-events-none group-hover:opacity-75"
              />
            )}
          </button>
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
