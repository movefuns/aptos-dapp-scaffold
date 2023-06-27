import { useEffect, useState } from "react";
import { Button, TextField, Stack, SxProps } from "@mui/material";

import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";

import { MyThemeSwitch } from "./components/MyThemeContext";
import { DAPP_ADDRESS, PackageLink } from "./utils/const";

const commonSx: SxProps = { width: "50%", marginLeft: "1rem" };

const App = () => {
  const [counter, updateCounter] = useState<{
    value: number;
    description: string;
    allow: string;
  }>({ value: 0, description: "", allow: "" });
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, wallet, signAndSubmitTransaction } = useWallet();
  const [coinInfo, updateAccountCoin] = useState({});
  const [hasCounter, updateHasCounter] = useState(false);

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
          const data = counter.data as any;
          console.log(`counter reuslt : ${JSON.stringify(data)}`);
          updateHasCounter(true);
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

  const createCounterHandle = async () => {
    const params = {
      type: "entry_function_payload",
      function: `${DAPP_ADDRESS}::mycounter::make_counter`,
      type_arguments: [],
      arguments: [counter.allow, counter.value, counter.description],
    };
    await signAndSubmitTransaction(params);
  };
  const updateCounterHandle = async () => {
    const params = {
      type: "entry_function_payload",
      function: `${DAPP_ADDRESS}::mycounter::update_counter`,
      type_arguments: [],
      arguments: [
        account?.address as string,
        counter.value,
        counter.description,
      ],
    };
    await signAndSubmitTransaction(params);
  };

  const deleteCounterHandle = async () => {
    const params = {
      type: "entry_function_payload",
      function: `${DAPP_ADDRESS}::mycounter::delete_counter`,
      type_arguments: [],
      arguments: [],
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
            sx={commonSx}
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
            sx={commonSx}
            onChange={(e) =>
              updateCounter({ ...counter, allow: e.target.value })
            }
          />
        </div>
        <div>
          <TextField
            label="Counter description"
            variant="standard"
            value={counter.description}
            sx={commonSx}
            onChange={(e) =>
              updateCounter({ ...counter, description: e.target.value })
            }
          />
        </div>
        <div>
          <Button
            sx={{
              ...commonSx,
              width: "25%",
            }}
            variant="contained"
            color="info"
            onClick={() => {
              hasCounter ? updateCounterHandle() : createCounterHandle();
            }}
          >
            {hasCounter ? "update counter" : "create counter"}
          </Button>
          {hasCounter && (
            <Button
              sx={{
                ...commonSx,
                width: "25%",
              }}
              variant="contained"
              color="error"
              onClick={deleteCounterHandle}
            >
              Delete My Counter
            </Button>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default App;
