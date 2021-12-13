import Link from "next/link";
import Image from "next/image";

const files = [
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
    title: "Polygon NFT Gallery",
    bgColor: "bg-gray-200",
    source: "/w3w.jpeg",
    href: "/nftgallery/polygon",
  },
  {
    title: "BSC NFT Gallery",
    bgColor: "bg-red-600",
    source: "/bsc-nftgallery.png",
    href: "/nftgallery/bsc",
  },
  {
    title: "Approved Contracts",
    bgColor: "bg-white",
    source: "/approved.png",
    href: "/approved",
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
