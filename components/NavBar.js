import Connector from "./Connector";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "../lib/web3";

export default function NavBar() {
  return (
    <div class="navbar mb-2 shadow-lg rounded-box">
      <a class="flex-1 px-2 mx-2" href="/">
        <img
          className="block h-12 w-auto"
          src="/BBox-logos_black.png"
          alt="BBox"
        />
      </a>
      <div title="Change Theme" class="dropdown dropdown-end">
        <div tabindex="0" class="m-1 normal-case btn-ghost btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current md:mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            ></path>
          </svg>
          <span class="hidden md:inline">Change Theme</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1792 1792"
            class="inline-block w-4 h-4 ml-1 fill-current"
          >
            <path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"></path>
          </svg>
        </div>
        <div class="mt-16 overflow-y-auto shadow-2xl top-px dropdown-content h-96 w-52 rounded-b-box bg-base-200 text-base-content">
          <ul class="p-4 menu compact">
            <li>
              <a
                tabindex="0"
                data-set-theme="light"
                data-act-class="active"
                class="active"
              >
                🌝  light
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="dark"
                data-act-class="active"
                class=""
              >
                🌚  dark
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="cupcake"
                data-act-class="active"
                class=""
              >
                🧁  cupcake
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="bumblebee"
                data-act-class="active"
                class=""
              >
                🐝  bumblebee
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="emerald"
                data-act-class="active"
                class=""
              >
                ✳️  Emerald
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="corporate"
                data-act-class="active"
                class=""
              >
                🏢  Corporate
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="synthwave"
                data-act-class="active"
                class=""
              >
                🌃  synthwave
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="retro"
                data-act-class="active"
                class=""
              >
                👴  retro
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="cyberpunk"
                data-act-class="active"
                class=""
              >
                🤖  cyberpunk
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="valentine"
                data-act-class="active"
                class=""
              >
                🌸  valentine
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="halloween"
                data-act-class="active"
              >
                🎃  halloween
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="garden" data-act-class="active">
                🌷  garden
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="forest" data-act-class="active">
                🌲  forest
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="aqua" data-act-class="active">
                🐟  aqua
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="lofi" data-act-class="active">
                👓  lofi
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="pastel" data-act-class="active">
                🖍  pastel
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="fantasy" data-act-class="active">
                🧚‍♀️  fantasy
              </a>
            </li>
            <li>
              <a
                tabindex="0"
                data-set-theme="wireframe"
                data-act-class="active"
              >
                📝  Wireframe
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="black" data-act-class="active">
                🏴  black
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="luxury" data-act-class="active">
                💎  luxury
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="dracula" data-act-class="active">
                🧛‍♂️  dracula
              </a>
            </li>
            <li>
              <a tabindex="0" data-set-theme="cmyk" data-act-class="active">
                🖨  CMYK
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex-none">
        <Web3ReactProvider getLibrary={getLibrary}>
          <Connector />
        </Web3ReactProvider>
      </div>
    </div>
  );
}
