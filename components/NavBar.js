import { Disclosure, Menu, Transition } from "@headlessui/react";
import Connector from "./Connector";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../lib/web3";

const navigation = [
  { name: "Overview", href: "#", current: true },
  // { name: "Team", href: "#", current: false },
  // { name: "Projects", href: "#", current: false },
  // { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  return (
    <Disclosure as="header" className="bg-white">
      <div className="relative py-6 sm:px-6 flex justify-between">
        <div className="relative mt-auto px-2 flex lg:px-0">
          <div className="flex-shrink-0 flex items-center">
            <a href="/">
              <span className="font-bold text-lg"> BBox </span>
            </a>
          </div>
        </div>
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
