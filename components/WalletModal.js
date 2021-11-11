import React from "react";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";

import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const connectorsByName = {
  injected,
};

// function getErrorMessage(error) {
//   if (error instanceof NoEthereumProviderError) {
//     return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network."
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected ||
//     error instanceof UserRejectedRequestErrorWalletConnect ||
//     error instanceof UserRejectedRequestErrorFrame
//   ) {
//     return 'Please authorize this website to access your Ethereum account.'
//   } else {
//     console.error(error)
//     return 'An unknown error occurred. Check the console for more details.'
//   }
// }

function getErrorMessage(error) {
  // if (error instanceof NoEthereumProviderError) {
  //   return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  // } else if (error instanceof UnsupportedChainIdError) {
  //   return "You're connected to an unsupported network.";
  // } else if (
  //   error instanceof UserRejectedRequestErrorInjected ||
  //   error instanceof UserRejectedRequestErrorWalletConnect ||
  //   error instanceof UserRejectedRequestErrorFrame
  // ) {
  //   return "Please authorize this website to access your Ethereum account.";
  // } else {
  console.error(error);
  return "An unknown error occurred. Check the console for more details.";
  // }
}

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function WalletModal() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  );
}

function ChainId() {
  const { chainId } = useWeb3React();

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ""}</span>
    </>
  );
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = React.useState();
  React.useEffect(() => {
    if (!!library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber) => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = (blockNumber) => {
        setBlockNumber(blockNumber);
      };
      library.on("block", updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener("block", updateBlockNumber);
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>{blockNumber === null ? "Error" : blockNumber ?? ""}</span>
    </>
  );
}

function Account() {
  const { account } = useWeb3React();

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? "-"
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ""}
      </span>
    </>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = React.useState();
  React.useEffect(() => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null ? "Error" : balance ? `Ξ${formatEther(balance)}` : ""}
      </span>
    </>
  );
}

function Header() {
  const { active, error } = useWeb3React();

  return (
    <>
      <h1 style={{ margin: "1rem", textAlign: "right" }}>
        {active ? "🟢" : error ? "🔴" : "🟠"}
      </h1>
      <h3
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr min-content 1fr",
          maxWidth: "20rem",
          lineHeight: "2rem",
          margin: "auto",
        }}
      >
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3>
    </>
  );
}

function App() {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  return (
    <>
      <Header />
      <hr style={{ margin: "2rem" }} />
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name];
          const activating = currentConnector === activatingConnector;
          const connected = currentConnector === connector;
          const disabled = !!activatingConnector || connected || !!error;

          return (
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                borderColor: activating
                  ? "orange"
                  : connected
                  ? "green"
                  : "unset",
                cursor: disabled ? "unset" : "pointer",
                position: "relative",
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector);
                activate(connectorsByName[name]);
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  color: "black",
                  margin: "0 0 0 1rem",
                }}
              >
                {activating && (
                  <svg
                    class="animate-spin h-5 w-5 mr-3 ..."
                    viewBox="0 0 24 24"
                  ></svg>
                )}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer",
            }}
            onClick={() => {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>

      <hr style={{ margin: "2rem" }} />

      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "fit-content",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage("👋")
                .then((signature) => {
                  window.alert(`Success!\n\n${signature}`);
                })
                .catch((error) => {
                  window.alert(
                    "Failure!" +
                      (error && error.message ? `\n\n${error.message}` : "")
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
      </div>
    </>
  );
}
