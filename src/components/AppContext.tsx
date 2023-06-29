import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import SupportWallet from "./SupportWallet";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { MyThemeContextProvider } from "./MyThemeContext";
import { FC, ReactNode } from "react";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const wallets = SupportWallet;

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={autoConnect}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MyThemeContextProvider>
      <AutoConnectProvider>
        <WalletContextProvider>{children}</WalletContextProvider>
      </AutoConnectProvider>
    </MyThemeContextProvider>
  );
};
