import { Disclosure, Menu, Transition } from "@headlessui/react";
import Connector from "./Connector";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../lib/web3";
import {
  WalletConnectButton,
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { useRouter } from "next/router";

// const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
const network = SOLANA_NETWORK;

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);
export default function NavBar() {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const router = useRouter();
  const { pathname } = router;

  return (
    <Disclosure as="header" className="bg-white">
      <div className="relative py-6 sm:px-6 flex justify-between">
        <a href="/">
          <img
            className="block h-12 w-auto"
            src="/BBox-logos_black.png"
            alt="BBox"
          />
        </a>
        <div className="flex items-center">
          {pathname.includes("spl") ? (
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider>
                <WalletMultiButton />
              </WalletProvider>
            </ConnectionProvider>
          ) : (
            <Web3ReactProvider getLibrary={getLibrary}>
              <Connector />
            </Web3ReactProvider>
          )}
        </div>
      </div>
      {/* <nav
            className="hidden lg:py-2 lg:flex lg:space-x-8"
            aria-label="Global"
          >
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                  "rounded-md py-2 px-3 inline-flex items-center text-sm font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav> */}
    </Disclosure>
  );
}
