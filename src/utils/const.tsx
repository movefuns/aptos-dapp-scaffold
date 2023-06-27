export const DAPP_ADDRESS =
  "0xfe9a66d4cc531639443bf0fc4fd88bbb9de60816aef44495b1e9a9ee3ed73fa6";
export const NETWORK = "testnet";

export const PackageLink = () => {
  return `https://explorer.aptoslabs.com/account/${DAPP_ADDRESS}/modules?network=${NETWORK}`;
};
