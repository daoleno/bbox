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
    source: "/cryptojobs.svg",
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
    title: "Issue Token On Solana",
    bgColor: "bg-green-0",
    source: "/comming.png",
    href: "/",
  },

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
            <button
              className={`group block w-full aspect-w-10 aspect-h-6 rounded-lg ${file.bgColor} focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden`}
            >
              <Image
                src={file.source}
                alt={file.title}
                className="object-cover pointer-events-none group-hover:opacity-75"
                layout="fill"
              />
            </button>
          </Link>
          <p className="mt-2 block text-sm text-center font-medium text-gray-900 truncate pointer-events-none">
            {file.title}
          </p>
        </li>
      ))}
    </ul>
  );
}
