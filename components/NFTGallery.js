import { useState, useEffect } from "react";
import {
  getErrorMessage,
  hasSupportedSuffix,
  toHttp,
  isVideo,
} from "../lib/web3";
import { useRouter } from "next/router";
import {
  tokensNFTETH,
  tokensNFTBSC,
  tokensPolygon,
  tokensNFTSOL,
} from "../lib/tokensNFT";
import Link from "next/link";
import {
  useNFT,
  useSolNFT,
  useTotalSupply,
  useContentType,
  useSolNFTCollection,
} from "../lib/hooks";
import Pagination from "./Pagination";
import Notify from "./Notify";
import ChainLogo from "./ChainLogo";
import { Trending, TrendingSimple } from "./Trending";
import dynamic from "next/dynamic";

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

export default function NFTGallery({ chain }) {
  const { query, replace, isReady } = useRouter();
  const { search, token_id } = query;
  const { totalSupply, error } = useTotalSupply(chain, search);
  const [fetchIndex, setFetchIndex] = useState(0);
  const [searchValue, setSearchValue] = useState(search);
  let tokensNFT;
  switch (chain) {
    case "eth":
      tokensNFT = tokensNFTETH;
      break;
    case "bsc":
      tokensNFT = tokensNFTBSC;
      break;
    case "polygon":
      tokensNFT = tokensPolygon;
      break;
    case "sol":
      tokensNFT = tokensNFTSOL;
    default:
  }

  function handleFetch(e) {
    e.preventDefault();
    replace(`?search=${searchValue}`);
  }

  useEffect(() => {
    setFetchIndex(+token_id || 0);
    if (fetchIndex > totalSupply) {
      setFetchIndex(totalSupply - onePageNumber);
    }
  }, [token_id]);

  return (
    <>
      {/* {error && <Notify error={getErrorMessage(error)} />} */}
      <div className="flex flex-col">
        <div class="z-0 flex-1 px-2 py-4 flex flex-wrap items-center justify-center ">
          <a href={`/nftgallery/${chain}`} className="label">
            <ChainLogo chain={chain} />
          </a>
          <div className="flex">
            <div className="form-control">
              <div class="relative">
                <input
                  type="text"
                  placeholder={
                    chain == "sol"
                      ? "Solscan Collection ID"
                      : "NFT Contract Address"
                  }
                  class="w-full pr-16 input input-primary input-bordered"
                  onInput={(e) => setSearchValue(e.target.value)}
                />
                <button
                  class="absolute top-0 right-0 rounded-l-none btn btn-primary"
                  onClick={handleFetch}
                >
                  go
                </button>
              </div>
            </div>
            {/* get random emojis */}
            <div className="text-center my-auto pl-3 text-3xl">
              <Link
                href={`?search=${
                  tokensNFT[Math.floor(Math.random() * tokensNFT.length)]
                    .address
                }`}
              >
                {emojis[Math.floor(Math.random() * emojis.length)]}
              </Link>
            </div>
          </div>
        </div>
        {!search && chain != "eth" && <TrendingSimple chain={chain} />}
        {!search && (chain === "eth" || chain === "sol") && (
          <Trending chain={chain} />
        )}

        {/* Loading Spinner */}
        {!isReady && (
          <div className="flex justify-center items-center mt-48">
            <img
              src="/rocket.png"
              className="animate-bounce h-32 w-32"
              alt="loading"
            />
          </div>
        )}
        {search && (
          <>
            <div className="hidden">
              <NFTCardPage
                chain={chain}
                address={search}
                index={fetchIndex + onePageNumber}
              />
            </div>
            <NFTCardPage chain={chain} address={search} index={fetchIndex} />
            <Pagination
              searchValue={search}
              fetchIndex={fetchIndex}
              totalSupply={totalSupply}
              setFetchIndex={setFetchIndex}
            />
          </>
        )}
      </div>
    </>
  );
}

function NFTCardPage({ chain, address, index }) {
  const pageLimit = index + onePageNumber;
  const { nfts: nftCollection, error } = useSolNFTCollection(
    chain,
    address,
    index,
    onePageNumber
  );
  let nfts = [];
  if (chain === "sol") {
    const solnfts = nftCollection.map((nft, i) => {
      return (
        <li key={i} className="relative">
          <NFTCard chain={chain} tokenURI={nft.info.data.uri} />
        </li>
      );
    });
    if (solnfts) {
      nfts = solnfts;
    }
  } else {
    for (let i = index; i < pageLimit; i++) {
      nfts.push(
        <li key={i} className="relative">
          <NFTCard chain={chain} address={address} index={i} />
        </li>
      );
    }
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

function NFTCard({ tokenURI, chain, address, index }) {
  const {
    nft: ethnft,
    isLoading: ethIsLoading,
    error: ethError,
  } = useNFT(chain, address, index);
  const {
    nft: solnft,
    isLoading: solIsLoading,
    error: solError,
  } = useSolNFT(tokenURI);

  const nft = solnft || ethnft;
  const isLoading = solIsLoading && ethIsLoading;
  const error = solError && ethError;

  // if has not suffix, send HEAD request to get context type
  const { contentType, error: errorContentType } = useContentType(
    nft && !hasSupportedSuffix(nft.image) && toHttp(nft.image)
  );

  if (isLoading)
    return (
      <>
        {error && <Notify error={getErrorMessage(error)} />}
        <div class="animate-pulse card text-center shadow-2xl hover:cursor-pointer overflow-visible">
          <figure class="animate-pulse group block w-full aspect-w-10 aspect-h-10 rounded-lg bg-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden" />
          <div class="card-body flex flex-row">
            <a class="card-title" target="_blank">
              ...
            </a>
          </div>
        </div>
      </>
    );

  const view =
    isVideo(nft?.image) || contentType?.includes("video") ? (
      <video class="rounded-xl" src={toHttp(nft?.image)} autoPlay loop muted />
    ) : (
      <img
        src={toHttp(nft?.image)}
        alt={nft?.name}
        class="rounded-xl bg-base-200 object-cover"
      />
    );

  return (
    <>
      {nft && (
        <>
          <div class="card text-center shadow-2xl hover:cursor-pointer overflow-visible">
            <figure class="group block w-full aspect-w-10 aspect-h-10 rounded-lg">
              {view}
            </figure>
            <div class="card-body flex flex-row pt-3 pb-0 px-3 md:pt-7 md:pb-3 md:px-10">
              <a
                class="card-title text-sm md:text-lg"
                href={toHttp(nft.image)}
                target="_blank"
              >
                {nft.name}
              </a>
              <div className="flex flex-row">
                <label for={nft.name} className="ml-3 hover:cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </label>
                <input type="checkbox" id={nft.name} class="modal-toggle" />
                <div class="modal">
                  <div class="modal-box text-left overflow-scroll">
                    <DynamicReactJson
                      src={nft}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      collapsed="1"
                      name={false}
                    />
                    <div class="modal-action">
                      <label for={nft.name} class="btn">
                        Close
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });
