import { useState } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { getErrorMessage, getLibrary, deployERC20 } from "../lib/web3";
import Notify from "../components/Notify";
import { injected } from "../lib/connectors";
import { useEagerConnect } from "../lib/hooks";
import { deployERC721 } from "../lib/web3";

export default function ERC721() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Issue />
    </Web3ReactProvider>
  );
}

function Issue() {
  const [values, setValues] = useState({
    name: "",
    symbol: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const { library, activate, active, error, setError } = useWeb3React();
  const [activating, setActivating] = useState(false);
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  async function handleIssue(e) {
    e.preventDefault();
    if (active) {
      try {
        await deployERC721(library.getSigner(), { ...values });
      } catch (e) {
        setError(e);
      }
    } else {
      setActivating(true);
      activate(injected);
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      {error && (
        <Notify key={new Date().getTime()} error={getErrorMessage(error)} />
      )}
      <div className="form-control">
        <label className="label block uppercase text-center font-bold mb-4">
          Issue ERC721 Token
        </label>
        <label className="label">
          <span className="label-text">Token Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          onChange={handleChange}
        />
        <label className="label">
          <span className="label-text">Token Symbol</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          onChange={handleChange}
        />
        <div className="flex justify-center -mx-3 mt-6">
          <button className="btn" onClick={handleIssue}>
            {active
              ? "Issue"
              : activating && !error
              ? "Connecting Wallet ..."
              : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
}
