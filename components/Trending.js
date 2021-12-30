import { useTopNFTs } from "../lib/hooks";
import { getErrorMessage } from "../lib/web3";
import Notify from "./Notify";
import { tokensNFTBSC, tokensPolygon } from "../lib/tokensNFT";

export function Trending({ chain }) {
  const { topNFTs, error } = useTopNFTs(chain);

  return (
    <>
      {error && <Notify error={getErrorMessage(error)} />}
      {topNFTs && (
        <>
          <div className="flex justify-between text-gray-600 hover:text-gray-900">
            <div className="flex ml-3 ">
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
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="font-sans mx-1">Top NFTs</h1>
            </div>
            <a
              href={
                chain == "sol"
                  ? "https://solscan.io/nfts#collections"
                  : "https://etherscan.io/tokens-nft"
              }
              target="_blank"
              className="flex justify-end mr-3"
            >
              {/* <span className="font-sans mx-1">View All</span> */}
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
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-col mt-3">
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
                          Collection
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Floor (Sales)
                        </th>
                        {/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Average
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Volume
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {chain == "sol" ? "Items" : "Sales"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {topNFTs.map((nft) => (
                        <tr
                          key={nft.nft_address || nft.data.collectionId}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap ">
                            <a
                              className="flex items-center"
                              href={`/nftgallery/${chain}?search=${
                                nft.nft_address || nft?.data?.collectionId
                              }`}
                            >
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-xl"
                                  src={nft.image || nft?.data?.avatar}
                                  alt={
                                    nft.nft_platform || nft?.data?.collection
                                  }
                                />
                              </div>
                              <div className="ml-4 text-sm font-medium text-gray-900">
                                {nft.nft_platform || nft?.data?.collection}
                              </div>
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {nft.floor_price || nft?.floorPrice / 1e9}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {nft.average_price}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {nft.total_value || nft?.volume / 1e9}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {nft.count || nft?.totalItems}
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
      )}
    </>
  );
}

export function TrendingSimple({ chain }) {
  let tokensNFT, browserURL;
  switch (chain) {
    case "bsc":
      tokensNFT = tokensNFTBSC;
      browserURL = "https://bscscan.com/tokens-nft";
      break;
    case "polygon":
      tokensNFT = tokensPolygon;
      browserURL = "https://polygonscan.com/tokens-nft";
      break;
  }

  return (
    <>
      {tokensNFT && (
        <>
          <div className="flex justify-between text-gray-600 hover:text-gray-900">
            <div className="flex ml-3 ">
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
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="font-sans mx-1">Top NFTs</h1>
            </div>
            <a
              href={browserURL}
              target="_blank"
              className="flex justify-end mr-3"
            >
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
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="flex flex-col mt-3">
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
                          Collection
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Address
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {tokensNFT.map((nft) => (
                        <tr key={nft.address} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap ">
                            <a
                              className="flex items-center"
                              href={`/nftgallery/${chain}?search=${nft.address}`}
                              target="_blank"
                            >
                              <div className="ml-4 text-sm font-medium text-gray-900">
                                {nft.name}
                              </div>
                            </a>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {nft.address}
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
      )}
    </>
  );
}
