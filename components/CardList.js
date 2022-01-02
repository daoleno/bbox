import Link from "next/link";
import Image from "next/image";

const files = [
  {
    title: "Crypto News",
    bgColor: "bg-yellow-300",
    source: "/cryptonews.svg",
    href: "/cryptonews",
  },
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
            <div class="card text-center shadow-2xl hover:cursor-pointer">
              <figure class="px-10 pt-10">
                <img src={file.source} class="rounded-xl" />
              </figure>
              <div class="card-body">
                <h2 class="card-title"> {file.title}</h2>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
