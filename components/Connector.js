import { useWeb3React } from "@web3-react/core";
import { useEagerConnect } from "../lib/hooks";
import { injected } from "../lib/connectors";
import Notify from "../components/Notify";
import { getErrorMessage } from "../lib/web3";

export default function Connector() {
  const { account, activate, active, error } = useWeb3React();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  async function handleActivate() {
    if (!active) {
      activate(injected);
    }
  }

  return (
    <>
      {error && (
        <Notify key={new Date().getTime()} error={getErrorMessage(error)} />
      )}
      <div className="relative  flex items-center">
        <button
          type="button"
          onClick={handleActivate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {active
            ? `${account.substring(0, 6)}...${account.substring(
                account.length - 4
              )}`
            : "Connect Wallet"}
        </button>
      </div>
    </>
  );
}
