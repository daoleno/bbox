import { useState, useEffect } from "react";
import { fetchNFT, parseIPFSURI } from "../lib/web3";
import Notify from "../components/Notify";
import { SearchIcon } from "@heroicons/react/solid";

// fetch nft list from https://etherscan.io/tokens-nft?sort=24h&order=desc&p=1
// [...document.querySelectorAll(".text-primary")].map(div => ({name:div.innerHTML, href:div.href}))

const tokensNFT = [
  {
    name: "mfer",
    href: "https://etherscan.io/token/0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
  },
  {
    name: "Crypto Bull Society",
    href: "https://etherscan.io/token/0x469823c7B84264D1BAfBcD6010e9cdf1cac305a3",
  },
  {
    name: "Wizards Dragons Game",
    href: "https://etherscan.io/token/0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab",
  },
  {
    name: "Original EtherEmojis",
    href: "https://etherscan.io/token/0xc4dc21607257d6a860f6a658fd52444b3e9c142a",
  },
  {
    name: "Elves of the North (ELVES)",
    href: "https://etherscan.io/token/0xff79127c3538aae46b6b15f056da677c07e60d8e",
  },
  {
    name: "Ethereum Name Service (ENS)",
    href: "https://etherscan.io/token/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
  },
  {
    name: "GoldHunter (GOLDH)",
    href: "https://etherscan.io/token/0x66fCA7555CD481545A5e66bA9a2bEC1e256F98e7",
  },
  {
    name: "Hammies",
    href: "https://etherscan.io/token/0x8826FB90Ca996018dC21e8aD104d75406dcdc9aD",
  },
  {
    name: "apekidsclub",
    href: "https://etherscan.io/token/0x9Bf252f97891b907F002F2887EfF9246e3054080",
  },
  {
    name: "Alien Secret Society",
    href: "https://etherscan.io/token/0x62d8aE32B0e6964d2126716cf3Da70C2bD062D94",
  },
  {
    name: "WebbLand",
    href: "https://etherscan.io/token/0xa1d4657e0e6507d5a94d06da93e94dc7c8c44b51",
  },
  {
    name: "PLUTO (PLUTO)",
    href: "https://etherscan.io/token/0xDfe3AC769b2d8E382cB86143E0b0B497E1ED5447",
  },
  {
    name: "Shark Outlaw Squad",
    href: "https://etherscan.io/token/0xa4eacdf4af749060a22aefe06337cb9fb96d45fb",
  },
  {
    name: "Goat Soup",
    href: "https://etherscan.io/token/0x608C2feb6B80993B26ffB6fa84F454Ad3Ac38bF0",
  },
  {
    name: "BearGame",
    href: "https://etherscan.io/token/0xe27a60f3cf27f716ac998b61492a36090973aac7",
  },
  {
    name: "Budverse Cans - Heritage Edition (BUDWEISER)",
    href: "https://etherscan.io/token/0xd6f4a923e2ecd9ab7391840ac78d04bfe40bd5e1",
  },
  {
    name: "FoxGame (FOX)",
    href: "https://etherscan.io/token/0x322f5577807185adaf3fA6512A7CCbbc32670c55",
  },
  {
    name: "SuperKongz",
    href: "https://etherscan.io/token/0x989e5f1da336c8a99a89e41594aa197735443563",
  },
  {
    name: "Lost Poets (POETS)",
    href: "https://etherscan.io/token/0x4b3406a41399c7FD2BA65cbC93697Ad9E7eA61e5",
  },
  {
    name: "Kong Game",
    href: "https://etherscan.io/token/0x4549AD11a0F37b3880d5bB4E54E45537DE41577D",
  },
  {
    name: "NFT Worlds (NFT Worlds)",
    href: "https://etherscan.io/token/0xBD4455dA5929D5639EE098ABFaa3241e9ae111Af",
  },
  {
    name: "Bored Ape Block Art Club",
    href: "https://etherscan.io/token/0x5336ed06fcbda33be9e5d2ea4962547fa317730a",
  },
  {
    name: "Swampverse (SWAMPER)",
    href: "https://etherscan.io/token/0x95784f7b5c8849b0104eaf5d13d6341d8cc40750",
  },
  {
    name: "Lil Baby Crypto Punks",
    href: "https://etherscan.io/token/0x3b1f210d55d8F2E866e422814Ae85eFdEf4cB922",
  },
  {
    name: "Pluto2",
    href: "https://etherscan.io/token/0x3F691327267993cFE4842CA1364A52DfE6190Ec1",
  },
  {
    name: "FND NFT (FNDNFT)",
    href: "https://etherscan.io/token/0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405",
  },
  {
    name: "Mirror Editions V3",
    href: "https://etherscan.io/token/0xdf5b5ee15cc96ba7d0cb6bd9b2c0fc4417ab6445",
  },
  {
    name: "Sandbox's LANDs",
    href: "https://etherscan.io/token/0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a",
  },
  {
    name: "Paradise Trippies",
    href: "https://etherscan.io/token/0x4cA4d3B5B01207FfCe9beA2Db9857d4804Aa89F3",
  },
  {
    name: "Crypto Killer",
    href: "https://etherscan.io/token/0x12d132c341e1e69821f8c4b1477c8287ef9f30f9",
  },
  {
    name: "KingFrogs",
    href: "https://etherscan.io/token/0xd668a2e001f3385b8bbc5a8682ac3c0d83c19122",
  },
  {
    name: "Monaco Planet (MONA)",
    href: "https://etherscan.io/token/0x21bf3da0cf0f28da27169239102e26d3d46956e5",
  },
  {
    name: "Skull Troopers",
    href: "https://etherscan.io/token/0xee4446483fb92b6d21488fd4937053a09a53b7b6",
  },
  {
    name: "Lil Baby Pudgy Penguins",
    href: "https://etherscan.io/token/0x42b448D40478a93D70739ac1aa82a4562f571A1D",
  },
  {
    name: "Crypto Carz",
    href: "https://etherscan.io/token/0x319944872ABe84F4a0C8eE2e68E436FA121f9824",
  },
  {
    name: "LONDON Embers",
    href: "https://etherscan.io/token/0x971fe57134d1b1b3d8d62ccadff1d2cf67e2b8ce",
  },
  {
    name: "Ether Orcs Genesis (Orcs)",
    href: "https://etherscan.io/token/0x3abedba3052845ce3f57818032bfa747cded3fca",
  },
  {
    name: "SergDickButts",
    href: "https://etherscan.io/token/0x3DffD6b352a16c154A8937d6591A204c349A5781",
  },
  {
    name: "Art Blocks",
    href: "https://etherscan.io/token/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
  },
  {
    name: "Uniswap V3: Positions NFT (UNI-V3-POS)",
    href: "https://etherscan.io/token/0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  {
    name: "Bear Game Gen Y",
    href: "https://etherscan.io/token/0xd930560fe9bd66a22e191be426e186249c794b71",
  },
  {
    name: "Land",
    href: "https://etherscan.io/token/0x2c88aa0956bc9813505d73575f653f69ada60923",
  },
  {
    name: "Crypto Raccoons",
    href: "https://etherscan.io/token/0x50b5b2e62fdf8c7428994aa803abf2e10bf17d0e",
  },
  {
    name: "Desperate ApeWives",
    href: "https://etherscan.io/token/0xf1268733c6fb05ef6be9cf23d24436dcd6e0b35e",
  },
  {
    name: "Bears Deluxe",
    href: "https://etherscan.io/token/0x4BB33f6E69fd62cf3abbcC6F1F43b94A5D572C2B",
  },
  {
    name: "DSC E-MATES | 4 DA NEXT LEVEL",
    href: "https://etherscan.io/token/0xd0242443f18586c389a1013539e93f3a7b27018c",
  },
  {
    name: "IXPanthers",
    href: "https://etherscan.io/token/0x959d00FdCAA75d27E0D520b545a0D566f13527F4",
  },
  {
    name: "Magnum",
    href: "https://etherscan.io/token/0x9523B6429924e4FAC50568572CF1d24697190c1d",
  },
  {
    name: "the littles NFT",
    href: "https://etherscan.io/token/0xc6ec80029cd2aa4b0021ceb11248c07b25d2de34",
  },
  {
    name: "Gray Boys",
    href: "https://etherscan.io/token/0x8d4100897447d173289560bc85c5c432be4f44e4",
  },
];

export default function NFTGallery() {
  const [error, setError] = useState();
  const [nfts, setNFTs] = useState([]);
  const [values, setValues] = useState({
    search: "",
  });
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  async function handleFetch(e) {
    e.preventDefault();
    try {
      await fetchNFT({ ...values, setNFTs });
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      {error && <Notify error={error} />}
      <div className="flex flex-col">
        <form
          className="relative z-0 flex-1 px-2 py-4 flex items-center justify-center"
          onSubmit={handleFetch}
        >
          <div className="max-w-xs w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
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
                placeholder="Search"
                type="search"
                onInput={handleChange}
              />
            </div>
          </div>
        </form>
        {nfts.length == 0 && (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 mt-8"
          >
            {tokensNFT.map((nft) => (
              <li key={nft.href} className="relative">
                <a
                  className="font-medium text-gray-900 truncate"
                  href={nft.href}
                >
                  {nft.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
          {nfts.map((file) => (
            <li key={file.image} className="relative">
              <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                <img
                  src={`https://ipfs.io/ipfs/${parseIPFSURI(file.image)}`}
                  alt=""
                  className="object-cover pointer-events-none group-hover:opacity-75"
                />
                <button
                  type="button"
                  className="absolute inset-0 focus:outline-none"
                >
                  <span className="sr-only">View details for {file.name}</span>
                </button>
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                {file.name}
              </p>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                {file.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
