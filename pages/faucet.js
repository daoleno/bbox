const faucets = [
  {
    name: "Ropsten, Rinkeby, Kovan, and Goerli",
    url: "https://app.mycrypto.com/faucet",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Ropsten 1",
    url: "https://faucet.metamask.io/",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Ropsten 2",
    url: "https://faucet.egorfine.com/",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Kovan",
    url: "https://gitter.im/kovan-testnet/faucet#",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Rinkeby",
    url: "https://faucets.chain.link/rinkeby",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Goerli 1",
    url: "https://faucet.goerli.mudit.blog/",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Goerli 2",
    url: "https://faucets.chain.link/goerli",
    logo: "/logo/ethereum.svg",
  },
  {
    name: "Polygon Testnet",
    url: "https://faucet.polygon.technology/",
    logo: "/logo/polygon.svg",
  },
  {
    name: "Binance Smart Chain Testnet",
    url: "https://testnet.binance.org/faucet-smart",
    logo: "/logo/bsc.svg",
  },
  {
    name: "OkexChain Testnet 1",
    url: "https://discord.com/invite/B5nMs6qK5F",
    logo: "/logo/okexchain.png",
  },
  {
    name: "OkexChain Testnet 2",
    url: "https://discord.com/invite/UsvashbQ4E",
    logo: "/logo/okexchain.png",
  },
  {
    name: "Solana Testnet/Devnet",
    url: "https://solfaucet.com/",
    logo: "/logo/solana.svg",
  },
  {
    name: "Cardano Testnet",
    url: "https://testnets.cardano.org/en/testnets/cardano/tools/faucet/",
    logo: "/logo/ada.svg",
  },
  {
    name: "Polkadot Testnet(Westend)",
    url: "https://wiki.polkadot.network/docs/learn-DOT#obtaining-testnet-dot",
    logo: "/logo/polkadot.svg",
  },
  {
    name: "XRP Testnet/Devnet",
    url: "https://xrpl.org/xrp-testnet-faucet.html",
    logo: "/logo/xrp.svg",
  },
  {
    name: "Terra Testnet",
    url: "https://faucet.terra.money/",
    logo: "/logo/luna.svg",
  },
  {
    name: "AVAX Fuji Testnet 1",
    url: "https://faucet.avax-test.network/",
    logo: "/logo/avax.svg",
  },
  {
    name: "AVAX Fuji Testnet 2",
    url: "https://faucets.chain.link/fuji",
    logo: "/logo/avax.svg",
  },
  {
    name: "Flow Testnet",
    url: "https://testnet-faucet.onflow.org/",
    logo: "/logo/flow.svg",
  },
];

export default function Faucet() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-10">
      {faucets.map((f) => (
        <div
          key={f.name}
          className="relative rounded-lg border bg-white dark:bg-gray-400  border-gray-300 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={f.logo} alt="" />
          </div>
          <div className="flex-1 min-w-0">
            <a href={f.url} className="focus:outline-none" target="_blank">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium">{f.name}</p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
