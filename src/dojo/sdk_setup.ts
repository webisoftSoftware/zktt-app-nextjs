import { init, SDK } from '@dojoengine/sdk'
import { schema, ZkttSchemaType } from '@/dojo/bindings/models.gen'
import manifest from "../dojo/manifest_dev.json"

import { DojoProvider } from "@dojoengine/core";

export const dojoProvider = (rpcUrl: string) =>
  new DojoProvider(manifest, rpcUrl);


// Initialize the Dojo SDK with your custom schema
export const getSDK = async () => {
  const {props} = getInitialProps();
  return await init<ZkttSchemaType>(
    {
      client: {
        rpcUrl: props.rpcUrl ?? "http://localhost:5050",
        toriiUrl: props.toriiUrl ?? "http://localhost:8080",
        relayUrl: props.relayUrl ?? "http://localhost:9090",
        worldAddress: props.worldAddress ?? "your-world-address", // Replace with your actual world address
      },
      domain: {
        name: "zktt",
        version: "1.0",
        chainId: props.chainId,
        revision: "1",
      },
    },
    schema
  );
}

export const getInitialProps = () => {
  // Access environment variables
  const { RPC_URL, TORII_URL, RELAY_URL, CHAIN_ID, WORLD_ADDRESS } = process.env;

  return {
    props: {
      rpcUrl: RPC_URL,
      toriiUrl: TORII_URL,
      relayUrl: RELAY_URL,
      chainId: CHAIN_ID,
      worldAddress: WORLD_ADDRESS
    }
  };
};

export const dojoSDK = async () => await getSDK();

export default async function Torii(dojoSDK: SDK<ZkttSchemaType>) {
  return dojoSDK.client;
}
