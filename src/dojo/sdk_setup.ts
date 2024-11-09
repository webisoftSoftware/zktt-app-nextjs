import { init } from '@dojoengine/sdk'
import { schema, ZkttSchemaType } from './bindings/models.gen'
import manifest from './manifest_dev.json'
import { DojoProvider } from '@dojoengine/core'
import { setupWorld } from './bindings/contracts.gen'

export const dojoProvider = (rpcUrl: string) => new DojoProvider(manifest, rpcUrl)

// Initialize the Dojo SDK with your custom schema
export const getSDK = async () => {
  const { props } = getEnv()
  return await init<ZkttSchemaType>(
    {
      client: {
        rpcUrl: props.rpcUrl ?? 'http://localhost:5050',
        toriiUrl: props.toriiUrl ?? 'http://localhost:8080',
        relayUrl: props.relayUrl ?? 'http://localhost:9090',
        worldAddress: props.worldAddress ?? 'your-world-address', // Replace with your actual world address
      },
      domain: {
        name: 'zktt',
        version: '1.0',
        chainId: props.chainId ?? 'KATANA',
        revision: '1',
      },
    },
    schema,
  )
}

export const getEnv = () => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return {
      props: {
        rpcUrl: '',
        toriiUrl: '',
        relayUrl: '',
        chainId: '',
        worldAddress: '',
      },
    }
  }

  // Access environment variables directly in client-side using Vite's import.meta.env
  const RPC_URL = import.meta.env.VITE_RPC_URL
  const TORII_URL = import.meta.env.VITE_TORII_URL
  const RELAY_URL = import.meta.env.VITE_RELAY_URL
  const CHAIN_ID = import.meta.env.VITE_CHAIN_ID
  const WORLD_ADDRESS = import.meta.env.VITE_WORLD_ADDRESS

  if (!RPC_URL || !TORII_URL || !RELAY_URL || !CHAIN_ID || !WORLD_ADDRESS) {
    console.error('Missing environment variables:', { RPC_URL, TORII_URL, RELAY_URL, CHAIN_ID, WORLD_ADDRESS });
  }

  return {
    props: {
      rpcUrl: RPC_URL || '',
      toriiUrl: TORII_URL || '',
      relayUrl: RELAY_URL || '',
      chainId: CHAIN_ID || '',
      worldAddress: WORLD_ADDRESS || '',
    },
  }
}

export default async function InitDojo() {
  const { props } = getEnv();
  // Initialize the SDK to get the torii client.
  let sdk = await getSDK();

  // Initialize the Dojo provider with the manifest and RPC URL to get the contracts in TS.
  let contracts = await setupWorld(dojoProvider(props.rpcUrl));
  console.log(sdk);
  console.log(contracts);
  return {
    sdk,
    contracts
  };
}