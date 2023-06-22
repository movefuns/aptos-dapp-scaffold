import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import Stack from "@mui/material/Stack";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";

function App() {
  const [count, setCount] = useState(100);
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, wallet } = useWallet();
  const [address, updateAddress] = useState("");
  const [coinInfo, updateAccountCoin] = useState({});
  let provider = new Provider(Network.MAINNET);
  switch (network?.name.toString()) {
    case Network.DEVNET:
      provider = new Provider(Network.DEVNET);
      break;
    case Network.TESTNET:
      provider = new Provider(Network.TESTNET);
      break;
  }

  useEffect(() => {
    const asyncTask = async () => {
      if (account) {
        const coins = await provider.getAccountCoinsData(account.address);
        console.log(coins);
        updateAccountCoin(coins);
      }
    };
    asyncTask();
  }, [account]);

  useEffect(() => {
    if (account) {
      updateAddress(account.address);
    }
  }, [account]);

  return (
    <div>
      <WalletConnector />
      <p>{JSON.stringify(wallet)}</p>
      <p>{JSON.stringify(network)}</p>
      <p>{JSON.stringify(account)}</p>
      <p>{JSON.stringify(coinInfo)}</p>
      <p>{address}</p>
      {autoConnect ? null : (
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setAutoConnect(true);
          }}
        >
          Set autoConnect
        </Button>
      )}

      <div className="card">
        <p>Current count value is : {count} </p>
        <Stack spacing={1} direction="row">
          <Button
            variant="contained"
            color="success"
            onClick={() => setCount((count) => count + 1)}
          >
            +
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => setCount((count) => count - 1)}
          >
            -
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export default App;
