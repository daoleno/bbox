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
          <div className="flex justify-between label">
            <div className="flex ml-3">
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

          <div className="overflow-x-auto">
            <table class="table w-full table-compact">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Floor (Sales)</th>
                  <th>Volume</th>
                  <th>{chain == "sol" ? "Items" : "Sales"}</th>
                </tr>
              </thead>
              <tbody>
                {topNFTs.map((nft) => (
                  <tr key={nft.address} class="hover">
                    <td>
                      <a
                        class="flex items-center space-x-3"
                        href={`/nftgallery/${chain}?search=${
                          nft.nft_address || nft?.data?.collectionId
                        }`}
                      >
                        <div class="avatar">
                          <div class="w-12 h-12 mask mask-squircle">
                            <img
                              src={nft.image || nft?.data?.avatar}
                              alt={nft.nft_platform || nft?.data?.collection}
                            />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">
                            {nft.nft_platform || nft?.data?.collection}
                          </div>
                        </div>
                      </a>
                    </td>
                    <td>{nft.floor_price || nft?.floorPrice / 1e9}</td>
                    <td>{nft.total_value || nft?.volume / 1e9}</td>
                    <td>{nft.count || nft?.totalItems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="flex justify-between label">
            <div className="flex ml-3">
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
          <div className="overflow-x-auto">
            <table class="table w-full table-compact">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {tokensNFT.map((nft) => (
                  <tr key={nft.address} class="hover">
                    <td>
                      <a
                        href={`/nftgallery/${chain}?search=${nft.address}`}
                        target="_blank"
                      >
                        {nft.name}
                      </a>
                    </td>
                    <td>{nft.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
