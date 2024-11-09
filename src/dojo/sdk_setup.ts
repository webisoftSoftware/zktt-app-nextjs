import { init, SDK } from '@dojoengine/sdk'
import { schema, ZkttSchemaType } from '../dojo/bindings/models.gen'
import manifest from "../dojo/manifest_dev.json"

import { DojoProvider } from "@dojoengine/core";
import { Entities, ToriiClient } from '@dojoengine/torii-wasm'

export const dojoProvider = (rpcUrl: string) =>
  new DojoProvider(manifest, rpcUrl);


// Initialize the Dojo SDK with your custom schema
export const getSDK = async () => {
  const {props} = getEnv();
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
        chainId: props.chainId ?? "KATANA",
        revision: "1",
      },
    },
    schema
  );
}

export const getAllEntities = async (limit: number, offset: number): Promise<Entities> => {
  let torii: ToriiClient = await getTorii(await getSDK());
  return torii.getAllEntities(limit, offset);
}

export const getEnv = () => {
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

export default async function getTorii(dojoSDK: SDK<ZkttSchemaType>) {
  return dojoSDK.client;
}

console.log(getAllEntities(10, 0));
