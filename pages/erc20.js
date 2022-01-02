import { useState } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { getErrorMessage, getLibrary, deployERC20 } from "../lib/web3";
import Notify from "../components/Notify";
import { injected } from "../lib/connectors";
import { useEagerConnect } from "../lib/hooks";

export default function ERC20() {
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
    decimals: 0,
    supply: 0,
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
        await deployERC20(library.getSigner(), { ...values });
      } catch (error) {
        setError(error);
      }
    } else {
      setActivating(true);
      activate(injected);
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto sm:mt-20">
      {error && <Notify error={getErrorMessage(error)} />}

      <div class="form-control">
        <label class="label block uppercase text-center font-bold mb-4">
          Issue ERC20 Token
        </label>
        <span class="label label-text">Token Name</span>
        <input
          type="text"
          class="input input-bordered"
          onChange={handleChange}
        />
        <span class="label label-text">Token Symbol</span>
        <input
          type="text"
          class="input input-bordered"
          onChange={handleChange}
        />
        <span class="label label-text">Total Supply</span>
        <input
          type="text"
          class="input input-bordered"
          onChange={handleChange}
        />
        <span class="label label-text">Decimal</span>
        <input
          type="text"
          class="input input-bordered"
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
