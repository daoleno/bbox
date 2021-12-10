import { useState, useEffect } from "react";
import { getErrorMessage, isVideo, toHttp } from "../lib/web3";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/dist/client/router";
import { tokensNFTETH, tokensNFTBSC, tokensPolygon } from "../lib/tokensNFT";
import Link from "next/link";
import PopOver from "./Popover";
import { useNFT, useTotalSupply } from "../lib/hooks";
import Pagination from "./Pagination";
import Notify from "./Notify";

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
    default:
      tokensNFT = tokensNFTETH;
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
        <form
          className="relative z-0 flex-1 px-2 py-4 flex flex-wrap items-center justify-center"
          onSubmit={handleFetch}
        >
          <ChainLogo chain={chain} />
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
                onInput={(e) => setSearchValue(e.target.value)}
              />
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
        </form>
        {!search && (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 mt-8 overflow-y-auto h-screen"
          >
            {tokensNFT.map((nft) => (
              <li key={`?search=${nft.address}`} className="relative">
                <a
                  title={nft.address}
                  href={`?search=${nft.address}`}
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

function NFTCardPage({ chain, address, index }) {
  const pageLimit = index + onePageNumber;
  const nfts = [];
  for (let i = index; i < pageLimit; i++) {
    nfts.push(
      <li key={i} className="relative">
        <NFTCard chain={chain} address={address} index={i} />
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

function NFTCard({ chain, address, index }) {
  const { nft, isLoading, error } = useNFT(chain, address, index);
  if (isLoading)
    return (
      <>
        {error && <Notify error={getErrorMessage(error)} />}
        <button className="animate-pulse group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"></button>
        <div className="flex justify-around mt-2 text-sm font-medium text-gray-900">
          ...
        </div>
      </>
    );

  return (
    <>
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

function ChainLogo({ chain }) {
  switch (chain) {
    case "eth":
      return (
        <a href={`/nftgallery/${chain}`}>
          <img
            className="w-48"
            src="/ethereum-logo-landscape-purple-white.jpg"
            alt="Ethereum"
          />
        </a>
      );
    case "polygon":
      return (
        <a href={`/nftgallery/${chain}`}>
          <svg
            className="w-28 mr-3 mb-3 md:mb-0 lg:mb-0 "
            viewBox="0 0 1024 225"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M400.611 71.671C406.893 75.4685 412.209 80.69 415.591 87.8103C419.457 94.9305 421.39 103.475 421.39 112.969C421.39 122.462 419.457 130.532 415.108 137.652C411.242 144.772 405.443 149.994 398.195 153.317C390.946 157.114 382.247 159.013 373.066 159.013C367.75 159.013 362.917 158.063 358.085 156.165C353.252 154.741 348.903 151.893 345.521 148.57V197.937H317.492V67.8735H341.655L344.071 78.3166C354.702 69.7723 366.3 65.5001 378.381 65.5001C386.597 65.5001 394.329 67.3989 400.611 71.671ZM385.147 130.532C389.979 126.26 392.396 120.563 392.396 113.443C392.396 106.323 389.979 100.627 385.63 95.8799C381.281 91.133 375.482 89.2343 369.2 89.2343C363.884 89.2343 359.051 90.1837 355.185 92.5571C351.32 94.4558 348.42 97.7786 346.004 102.051V123.412C347.454 127.684 350.353 131.006 353.736 133.38C357.602 135.753 361.951 137.177 367.267 137.177C374.515 137.177 380.314 134.804 385.147 130.532Z"
                fill="black"
              />
              <path
                d="M437.819 88.2748C442.169 81.6293 447.967 75.9331 455.699 72.1356C463.431 68.3381 472.13 65.9647 481.795 65.9647C491.46 65.9647 500.158 67.8635 507.89 72.1356C515.139 75.9331 520.938 81.6293 525.287 88.7495C529.636 95.8698 531.569 103.465 531.569 112.484C531.569 121.503 529.636 129.098 525.287 136.218C520.938 143.338 515.622 149.034 507.89 152.832C500.641 156.629 491.46 159.003 481.795 159.003C472.13 159.003 463.431 157.104 455.699 153.306C447.967 149.509 442.169 144.287 437.819 137.167C433.953 130.047 431.537 121.977 431.537 112.484C431.537 103.465 433.953 95.3951 437.819 88.2748ZM466.331 129.572C470.197 134.319 475.513 136.218 481.795 136.218C488.077 136.218 493.393 133.844 497.259 129.572C501.125 125.3 503.058 119.129 503.058 112.484C503.058 105.363 501.125 99.6672 497.259 95.3951C492.909 90.6483 488.077 88.2748 481.312 88.2748C475.029 88.2748 470.197 90.6483 465.848 94.9204C461.982 99.6672 460.049 105.363 460.049 112.484C460.049 119.129 461.982 124.825 466.331 129.572Z"
                fill="black"
              />
              <path
                d="M576.999 0.463867V156.635H548.971V0.463867H576.999Z"
                fill="black"
              />
              <path
                d="M692.008 70.2406L634.985 198.405H607.924L629.186 152.361L588.594 70.2406H620.488L643.684 121.506L666.88 70.2406H692.008Z"
                fill="black"
              />
              <path
                d="M799.285 70.2369V156.629C799.285 164.699 796.869 172.294 792.036 178.939C787.204 185.585 780.922 190.807 772.706 194.604C764.491 198.401 755.793 200.3 746.128 200.3C738.879 200.3 732.597 199.351 727.281 197.927C721.966 196.028 717.616 194.129 714.234 192.231C710.368 189.857 706.502 187.009 702.152 183.212L718.583 164.224C722.449 168.022 726.798 170.87 730.664 172.769C734.53 174.667 739.846 176.091 745.645 176.091C752.893 176.091 758.692 174.193 763.525 170.87C768.357 167.547 770.773 162.326 770.773 156.155V143.813C767.874 148.085 764.008 151.882 758.209 154.731C752.41 157.579 745.645 159.003 737.913 159.003C730.181 159.003 722.449 157.104 715.683 152.832C708.918 149.034 703.602 143.338 699.253 136.218C695.387 129.098 692.971 121.503 692.971 112.958C692.971 104.414 694.904 96.3445 699.253 89.2242C703.602 82.104 708.918 76.4078 716.167 72.1356C722.932 67.8635 730.181 65.9647 737.913 65.9647C745.161 65.9647 751.444 66.9141 757.243 68.8128C763.042 70.7116 767.391 73.5597 770.29 76.8824L773.19 70.2369H799.285ZM770.773 123.401V102.041C768.84 97.7685 765.941 94.4457 761.592 92.0723C757.243 89.6989 752.41 88.2749 746.611 88.2749C739.846 88.2749 734.047 90.6483 729.214 94.9204C724.382 99.1926 721.965 104.889 721.965 112.009C721.965 118.655 724.382 124.826 729.214 129.572C734.047 134.319 739.846 136.693 746.611 136.693C757.726 136.218 765.941 131.946 770.773 123.401Z"
                fill="black"
              />
              <path
                d="M822.489 88.2849C826.839 81.1647 832.637 75.9432 840.369 71.671C848.101 67.8735 856.8 65.5001 866.465 65.5001C876.13 65.5001 884.828 67.3989 892.56 71.671C899.809 75.4685 905.608 81.1647 909.957 88.2849C913.823 95.4052 916.239 103 916.239 112.019C916.239 121.038 914.306 128.633 909.957 135.753C906.091 142.874 900.292 148.57 892.56 152.367C885.311 156.165 876.13 158.538 866.465 158.538C856.8 158.538 848.101 156.639 840.369 152.842C832.637 149.044 826.839 143.823 822.489 136.703C818.14 129.582 816.207 121.513 816.207 111.544C816.207 103.475 818.14 95.4052 822.489 88.2849ZM850.518 129.582C854.384 134.329 859.699 136.228 865.981 136.228C872.264 136.228 877.579 133.855 881.445 129.582C885.311 125.31 887.244 119.139 887.244 112.494C887.244 105.374 885.311 99.6773 881.445 95.4052C877.579 91.133 872.264 88.7596 865.981 88.7596C859.699 88.7596 854.867 91.133 850.518 95.4052C846.168 99.6773 844.235 105.848 844.235 112.494C844.719 119.139 846.652 124.836 850.518 129.582Z"
                fill="black"
              />
              <path
                d="M1015.3 73.085C1021.1 77.8318 1023.52 84.0027 1024 91.5976V156.629H995.491V102.041C995.008 93.4964 990.659 89.2242 982.443 89.2242C976.161 89.2242 970.846 92.0723 966.98 98.2432C963.114 104.414 961.181 112.009 961.181 121.028V156.629H933.152V70.2369H958.764L960.697 84.0027C964.08 78.3065 968.429 74.0343 974.228 70.7116C980.027 67.3888 986.793 65.9647 994.525 65.9647C1002.74 65.9647 1009.99 68.3381 1015.3 73.085Z"
                fill="black"
              />
              <path
                d="M197.648 68.8237C192.815 65.9756 186.533 65.9756 181.218 68.8237L143.524 90.6592L117.912 104.9L80.219 126.735C75.3865 129.583 69.1043 129.583 63.7886 126.735L33.8273 109.646C28.9948 106.798 25.6121 101.577 25.6121 95.8807V62.1781C25.6121 56.4819 28.5116 51.2604 33.8273 48.4123L63.3053 31.7984C68.1378 28.9503 74.42 28.9503 79.7357 31.7984L109.214 48.4123C114.046 51.2604 117.429 56.4819 117.429 62.1781V84.0136L143.041 69.2984V47.463C143.041 41.7667 140.142 36.5452 134.826 33.6971L80.219 2.36801C75.3865 -0.480092 69.1043 -0.480092 63.7886 2.36801L8.2152 33.6971C2.89948 36.5452 0 41.7667 0 47.463V110.596C0 116.292 2.89948 121.514 8.2152 124.362L63.7886 155.691C68.621 158.539 74.9033 158.539 80.219 155.691L117.912 134.33L143.524 119.615L181.218 98.2541C186.05 95.406 192.332 95.406 197.648 98.2541L227.126 114.868C231.958 117.716 235.341 122.938 235.341 128.634V162.336C235.341 168.033 232.442 173.254 227.126 176.102L197.648 193.191C192.815 196.039 186.533 196.039 181.218 193.191L151.74 176.577C146.907 173.729 143.524 168.507 143.524 162.811V140.976L117.912 155.691V177.526C117.912 183.222 120.812 188.444 126.127 191.292L181.701 222.621C186.533 225.469 192.815 225.469 198.131 222.621L253.705 191.292C258.537 188.444 261.92 183.222 261.92 177.526V114.393C261.92 108.697 259.02 103.476 253.705 100.628L197.648 68.8237Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="1024" height="225" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
      );
    case "bsc":
      return (
        <a href={`/nftgallery/${chain}`}>
          <img className="w-48" src="/bsc.webp" alt="bsc" />
        </a>
      );
  }
}
