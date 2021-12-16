import { Disclosure, Menu, Transition } from "@headlessui/react";
import Connector from "./Connector";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../lib/web3";

export default function NavBar() {
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
        <Web3ReactProvider getLibrary={getLibrary}>
          <Connector />
        </Web3ReactProvider>
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
