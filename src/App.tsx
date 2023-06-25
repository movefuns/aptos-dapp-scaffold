import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";
import Stack from "@mui/material/Stack";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";
import Switch from "@mui/material/Switch";
import { MyThemeContext } from "./components/MyThemeContext";

function App() {
  const { updateTheme, themeMode } = useContext(MyThemeContext);
  const [count, setCount] = useState(1000);
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { network, account, wallet } = useWallet();
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
      }
    };
    asyncTask();
  }, [account]);

  useEffect(() => {
    if (account) {
      updateAddress(account.address);
    }
  }, [account]);

  const [checked, setChecked] = useState(themeMode === "light");

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
    if (checked) {
      updateTheme("dark");
    } else {
      updateTheme("light");
    }
  };

  return (
    <div>
      <WalletConnector />

      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
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
