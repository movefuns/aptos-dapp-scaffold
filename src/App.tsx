import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Stack,
  SxProps,
  Divider,
  LinearProgress,
} from "@mui/material";

import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";

import { MyThemeSwitch } from "./components/MyThemeContext";
import { DAPP_ADDRESS, PackageLink } from "./utils/const";

const commonSx: SxProps = { width: "50%", marginLeft: "1rem" };

const WalletLoading = () => {
  const { connected } = useWallet();
  const [connectTimeout, updateConnectTimeout] = useState(false);
  const { autoConnect } = useAutoConnect();

  useEffect(() => {
    setTimeout(() => {
      updateConnectTimeout(true);
    }, 2000);
  }, []);

  return (
    <>
      {connected ? null : (
        <>
          {autoConnect ? (
            connectTimeout ? null : (
              <LinearProgress color="secondary" sx={{ marginBottom: "1rem" }} />
            )
          ) : null}
        </>
      )}
    </>
  );
};

const App = () => {
  const [counter, updateCounter] = useState<{
    value: number;
    description: string;
    allow: string;
  }>({ value: 0, description: "", allow: "" });
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, signAndSubmitTransaction, connected } = useWallet();
  const [coinInfo, updateAccountCoin] = useState<any>({});
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
    setTimeout(() => updateConnectTimeout(true), 3500);
  }, []);

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
        {autoConnect ? null : connected ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setAutoConnect(true);
            }}
          >
            Set autoConnect
          </Button>
        ) : null}
      </div>
    );
  };

  const BasicWallet = () => {
    return (
      <div>
        <p>Network : {network && network.name}</p>
        <b>Address : {account?.address}</b>
        <p>Publickey : {account?.publicKey}</p>
        <div>
          <p>Coin List </p>
          <ul>
            {coinInfo.current_coin_balances &&
              coinInfo.current_coin_balances.map((item: any) => {
                return (
                  <li key={item.coin_type}>
                    {item.coin_type}
                    <b style={{ marginLeft: "1rem" }}>{item.amount}</b>
                    <b style={{ marginLeft: "1rem" }}>
                      {item.coin_info.symbol}
                    </b>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <WalletLoading />

      <div>
        <MyHeader />
        <BasicWallet />

        <Divider sx={{ margin: "1rem" }}>Aptos Counter Operate</Divider>
        <Stack direction="column" spacing={3}>
          <div>
            <TextField
              label="Counter value"
              variant="standard"
              type="number"
              value={counter.value}
              sx={commonSx}
              onChange={(e) =>
                updateCounter({
                  ...counter,
                  value: parseInt(e.target.value, 10),
                })
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
    </>
  );
};

export default App;
