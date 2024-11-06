import { Chain, mainnet, sepolia } from '@starknet-react/chains'
import { Connector, StarknetConfig, starkscan } from '@starknet-react/core'
import { PropsWithChildren } from 'react'
import CartridgeConnector from '@cartridge/connector'
import { RpcProvider, shortString } from 'starknet'

// deleted the constants we only need actions address?>>
const ACTIONS_ADDRESS='0x0036e4506b35e6dfb301d437c95f74b3e1f4f82da5d8841bec894bb8de29ec13';
export function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig autoConnect chains={[mainnet]} connectors={[cartridge as unknown as Connector]} explorer={starkscan} provider={provider}>
      {children}
    </StarknetConfig>
  )
}
const cartridge = new CartridgeConnector({
  policies: [
    {
      target: ACTIONS_ADDRESS,
      method: 'spawn',
      description: 'spawn thing',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'move',
      description: 'move character',
    },
  ],
  url: 'https://x.cartridge.gg',
  rpc: 'https://api.cartridge.gg/x/starknet/mainnet',
  //rpc: 'http://0.0.0.0:5050',
  paymaster: {
    caller: shortString.encodeShortString('ANY_CALLER'),
  },
  theme: 'abc',
})
function provider(chain: Chain) {
  switch (chain) {
    case mainnet:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
      })
    case sepolia:
    default:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
      })
  }
}