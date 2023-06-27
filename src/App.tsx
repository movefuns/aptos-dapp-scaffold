import { useEffect, useState } from "react";
import { Button, TextField, Stack } from "@mui/material";

import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";

import { MyThemeSwitch } from "./components/MyThemeContext";
import { DAPP_ADDRESS, PackageLink } from "./utils/const";

function App() {
  const [counter, updateCounter] = useState<{
    value: number;
    description: string;
    allow: string;
  }>({ value: 0, description: "", allow: "" });
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, wallet, signAndSubmitTransaction } = useWallet();
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
          console.log(`counter reuslt : ${JSON.stringify(counter)}`);
          const data = counter.data as any;
          updateCounter({
            value: data.value,
            description: data.description,
            allow: data.allow,
          });
        }
      }
    };
    asyncTask();
  }, [account]);

  const createCounter = async () => {
    const params = {
      type: "entry_function_payload",
      function: `${DAPP_ADDRESS}::mycounter::make_counter`,
      type_arguments: [],
      arguments: [counter.allow, counter.value, counter.description],
    };
    await signAndSubmitTransaction(params);
  };

  const MyHeader = () => {
    return (
      <div>
        <WalletConnector />
        <MyThemeSwitch />
        <span
          style={{
            float: "right",
            marginRight: "1.5rem",
          }}
        >
          Explorer:{" "}
          <a target="_blank" rel="noreferrer" href={PackageLink()}>
            {DAPP_ADDRESS}
          </a>
        </span>
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
      </div>
    );
  };

  const BasicWallet = () => {
    return (
      <div style={{ marginTop: "2rem" }}>
        <p>{JSON.stringify(wallet)}</p>
        <p>{JSON.stringify(network)}</p>
        <p>{JSON.stringify(account)}</p>
        <p>{JSON.stringify(coinInfo)}</p>
      </div>
    );
  };

  return (
    <div>
      <MyHeader />
      <BasicWallet />

      <Stack direction="column" spacing={3}>
        <div>
          <TextField
            label="Counter value"
            variant="standard"
            type="number"
            value={counter.value}
            sx={{
              width: "50%",
            }}
            onChange={(e) =>
              updateCounter({ ...counter, value: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
          <TextField
            label="Allow update address"
            variant="standard"
            value={counter.allow}
            sx={{
              width: "50%",
            }}
            onChange={(e) =>
              updateCounter({ ...counter, allow: e.target.value })
            }
          />
        </div>
        <div>Description: {counter.description}</div>
        <div>
          <Button
            sx={{
              marginTop: "1rem",
            }}
            variant="contained"
            color="info"
            onClick={() => {
              counter.value === 0 ? createCounter() : createCounter();
            }}
          >
            {counter.value === 0 ? "create counter" : "update counter"}
          </Button>
        </div>
      </Stack>
    </div>
  );
}

export default App;
