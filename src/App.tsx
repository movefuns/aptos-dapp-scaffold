import { useState } from "react";
import "./App.css";
import { Button } from "@mui/material";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { useAutoConnect } from "./components/AutoConnectProvider";

function App() {
  const [count, setCount] = useState(0);
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <div className="App">
      <div>
        <WalletConnector />
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
      <h1>Vite + React + + Typescript + MUI 5</h1>
      <Button color="secondary">Secondary</Button>
      <Button variant="contained" color="success">
        Success
      </Button>
      <Button variant="outlined" color="error">
        Error
      </Button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
