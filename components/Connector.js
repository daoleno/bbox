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
      <button onClick={handleActivate} className="btn btn-primary">
        {active
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : "Connect Wallet"}
      </button>
    </>
  );
}
