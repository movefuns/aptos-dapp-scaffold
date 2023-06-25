import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import Stack from "@mui/material/Stack";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";

import { MyThemeSwitch } from "./components/MyThemeContext";
import { DAPP_ADDRESS } from "./utils/const";

function App() {
  const [counter, updateCounter] = useState<any>({});
  const [count, setCount] = useState(1000);
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, wallet, signAndSubmitTransaction } = useWallet();
  const [address, updateAddress] = useState("");
  const [coinInfo, updateAccountCoin] = useState({});

  let provider = new Provider(Network.MAINNET);
  if (network && network.name) {
    switch (network?.name.toLowerCase()) {
      case Network.DEVNET:
      case Network.TESTNET:
        provider = new Provider(network?.name.toLowerCase() as Network);
    }
  }

  useEffect(() => {
    const asyncTask = async () => {
      if (account) {
        const coins = await provider.getAccountCoinsData(account.address);
        console.log(coins);
        updateAccountCoin(coins);

        const counter = await provider.aptosClient
          .getAccountResource(
            account.address.toString(),
            `${DAPP_ADDRESS}::mycounter::CounterHolder`
          )
          .catch((err) => {
            console.log(err);
          });

        if (counter) {
          updateCounter(counter);
        }
      }
    };
    asyncTask();
  }, [account]);

  useEffect(() => {
    if (account) {
      updateAddress(account.address);
    }
  }, [account]);

  const createCounter = async () => {
    const params = {
      type: "entry_function_payload",
      function: `${DAPP_ADDRESS}::mycounter::make_counter`,
      type_arguments: [],
      arguments: [
        "0x3ee0661c3e99c34d502daa36a2bd12b6b3bd52b6762c2f071cddd6a187b17309",
        0,
        "hello default message",
      ],
    };
    await signAndSubmitTransaction(params);
  };

  return (
    <div>
      <WalletConnector />
      <MyThemeSwitch />
      <p>{JSON.stringify(wallet)}</p>
      <p>{JSON.stringify(network)}</p>
      <p>{JSON.stringify(account)}</p>
      <p>{JSON.stringify(coinInfo)}</p>
      <p>{address}</p>
      <p>
        {counter.data == null ? (
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              createCounter();
            }}
          >
            Create a counter
          </Button>
        ) : (
          <>
            counter holder :{" "}
            <b>
              <pre>{JSON.stringify(counter, null, 2)}</pre>
            </b>
          </>
        )}
      </p>
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
