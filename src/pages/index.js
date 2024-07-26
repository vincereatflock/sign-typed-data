import { AuthType } from "@particle-network/auth-core";
import { ConnectButton, useAccountInfo, useConnectKit, useParticleConnect } from "@particle-network/connectkit";
import { isEVMProvider } from "@particle-network/connectors";
import { useEffect, useState } from "react";

const ConnectKitDemo = () => {
  const { account, particleProvider } = useAccountInfo();
  const connectKit = useConnectKit();
  const { connect } = useParticleConnect();
  const [chainId, setChainId] = useState(85432);

  useEffect(() => {
    async function getChainId() {
      if (!particleProvider) {
        return;
      }

      if (isEVMProvider(particleProvider)) {
        const chainId = await particleProvider?.request({ method: "eth_chainId" });
        console.log('CHAIN ID', chainId)
        setChainId(chainId);
      }
    }

    getChainId();
  }, [particleProvider]);

  const msg = {
    primaryType: "AuthenticationMessageStruct",
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
      ],
      AuthenticationMessageStruct: [
        {
          name: "timestamp",
          type: "uint256",
        },
      ],
    },
    domain: {
      name: "Flock.io",
      version: "1.0.0",
      chainId: chainId,
    },
    message: {
      timestamp: 1721844298,
    },
  };

  const signMessage = async () => {
    if (!particleProvider) {
      throw new Error("Please connect wallet first!");
    }
    try {
      let signature;
      if (isEVMProvider(particleProvider)) {
        signature = await particleProvider.request({
          method: "eth_signTypedData_v4",
          params: [account, JSON.stringify(msg)],
        });

        alert(
          JSON.stringify({
            message: "Sign Success",
            description: signature,
          })
        );
      }
    } catch (error) {
      alert(
        JSON.stringify({
          message: "Sign Error",
          description: error.message || error,
        })
      );
    }
  };

  const connectWallet = async (id, type) => {
    if (!connectKit) {
      return;
    }
    try {
      await connect({ preferredAuthType: type, id });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-[250px]">
        <ConnectButton />
      </div>
      <div className="text-2xl font-bold mb-4">Particle ConnectKit Demo</div>
      {!account && (
        <div className="flex flex-col gap-4">
          <button style={{ marginTop: 10, borderRadius: 10 }} onClick={() => connectWallet("particle")}>
            Particle
          </button>
          <button style={{ marginTop: 10, borderRadius: 10 }} onClick={() => connectWallet("particle", AuthType.google)}>
            Google
          </button>
          <button style={{ marginTop: 10, borderRadius: 10 }} onClick={() => connectWallet("metamask")}>
            Metamask
          </button>
          <button style={{ marginTop: 10, borderRadius: 10 }} onClick={() => connectWallet("walletconnect_v2")}>
            WalletConnect
          </button>
        </div>
      )}

      {account && (
        <div className="" title="Sign Message" style={{ borderRadius: 10 }}>
          <button style={{ marginTop: 10, width: "100%", borderRadius: 10 }} onClick={signMessage}>
            SIGN
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectKitDemo;
