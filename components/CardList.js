import Link from "next/link";

const files = [
  {
    title: "Crypto News",
    bgColor: "bg-yellow-300",
    source: "/cryptonews.svg",
    href: "/cryptonews",
  },
  // {
  //   title: "Crypto Dev",
  //   bgColor: "bg-yellow-300",
  //   source: "/cryptodev.svg",
  //   href: "/cryptodev",
  // },
  {
    title: "Crypto Jobs",
    bgColor: "bg-sky-300",
    source: "/freelancing.png",
    href: "/cryptojobs",
  },
  {
    title: "Issue ERC20",
    bgColor: "bg-blue-500",
    source: "/developers-eth-blocks.png",
    href: "/erc20",
  },
  {
    title: "Issue ERC721",
    bgColor: "bg-red-200",
    source: "/doge-computer.png",
    href: "/erc721",
  },
  {
    title: "NFT.STORAGE",
    bgColor: "bg-red-500",
    source: "/logo-nft.storage.png",
    href: "/nftstorage",
  },
  {
    title: "Ethereum NFT Gallery",
    bgColor: "bg-purple-300",
    source: "/alpha-girls.png",
    href: "/nftgallery/eth",
  },
  {
    title: "BSC NFT Gallery",
    bgColor: "bg-red-600",
    source: "/bsc-nftgallery.png",
    href: "/nftgallery/bsc",
  },
  {
    title: "Polygon NFT Gallery",
    bgColor: "bg-gray-200",
    source: "/w3w.jpeg",
    href: "/nftgallery/polygon",
  },
  {
    title: "Solana NFT Gallery",
    bgColor: "bg-black",
    source: "/solnft.jpeg",
    href: "/nftgallery/sol",
  },
  {
    title: "Ethereum Token Approval",
    bgColor: "bg-blue-500",
    source: "/approved.png",
    href: "/approved/eth",
  },
  {
    title: "BSC Token Approval",
    bgColor: "bg-yellow-500",
    source: "/approved.png",
    href: "/approved/bsc",
  },
  {
    title: "Polygon Token Approval",
    bgColor: "bg-purple-500",
    source: "/approved.png",
    href: "/approved/polygon",
  },
  {
    title: "Gas Now",
    bgColor: "bg-blue-300",
    source: "/transistor-green-energy.png",
    href: "/gasnow",
  },
  {
    title: "Faucet",
    bgColor: "bg-sky-100",
    source: "/faucet.svg",
    href: "/faucet",
  },
  {
    title: "Token Info",
    bgColor: "bg-blue-300",
    source: "/tokeninfo.png",
    href: "/tokeninfo",
  },
  {
    title: "Hex to Number",
    bgColor: "bg-blue-300",
    source: "/hextonumber.png",
    href: "/hextonumber",
  },
  // {
  //   title: "Issue Token On Solana",
  //   bgColor: "bg-green-0",
  //   source: "/comming.png",
  //   href: "/spltoken",
  // },

  // More files...
];

export default function CardList() {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-36"
    >
      {files.map((file) => (
        <li key={file.title} className="relative">
          <Link href={file.href}>
            <div className="card text-center shadow-2xl hover:cursor-pointer w-100">
              <div className="px-2 pt-3 md:px-5 md:pt-5">
                <figure
                  className={`aspect-w-10 aspect-h-7 rounded-xl ${file.bgColor}`}
                >
                  <img
                    src={file.source}
                    className="object-cover pointer-events-none group-hover:opacity-75 rounded-xl"
                  />
                </figure>
              </div>
              <div className="card-body pt-3 pb-1">
                <h2 className="card-title text-sm md:text-lg"> {file.title}</h2>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
