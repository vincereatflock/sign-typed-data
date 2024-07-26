import { BaseSepolia, EthereumSepolia } from "@particle-network/chains";
import { ModalProvider } from "@particle-network/connectkit";
import "@particle-network/connectkit/dist/index.css";
import { evmWallets, solanaWallets } from "@particle-network/connectors";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ModalProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        chains: [BaseSepolia, EthereumSepolia],
        connectors: [...evmWallets({ projectId: "21d2a01621c47fb5f34b06c6390ac0bb", showQrModal: true }), ...solanaWallets()],
        wallet: {
          customStyle: {
            supportChains: [BaseSepolia, EthereumSepolia],
          },
        },
      }}
    >
      <Component {...pageProps} />
    </ModalProvider>
  );
}
