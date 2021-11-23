import Link from "next/link";

const files = [
  {
    title: "Issue ERC20",
    bgColor: "bg-blue-500",
    source: "/developers-eth-blocks.png",
    href: "/erc20",
  },
  {
    title: "Issue NFT",
    bgColor: "bg-red-200",
    source: "doge-computer.png",
    href: "/",
  },
  {
    title: "Upload To IPFS",
    bgColor: "bg-green-0",
    source: "ipfs-logo-vector-ice-text.svg",
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
        <li key={file.source} className="relative">
          <div
            className={`group block w-full aspect-w-10 aspect-h-6 rounded-lg ${file.bgColor} focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden`}
          >
            <img
              src={file.source}
              alt={file.title}
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
            <Link href={file.href}>
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {file.title}</span>
              </button>
            </Link>
          </div>
          <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
            {file.title}
          </p>
        </li>
      ))}
    </ul>
  );
}