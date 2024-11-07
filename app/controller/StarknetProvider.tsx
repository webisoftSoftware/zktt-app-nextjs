import { Chain, mainnet, sepolia } from '@starknet-react/chains'
import { Connector, StarknetConfig, starkscan } from '@starknet-react/core'
import { PropsWithChildren } from 'react'
import CartridgeConnector from '@cartridge/connector'
import { RpcProvider, shortString } from 'starknet'

// hard coded contract address temporary
const ACTIONS_ADDRESS='0x0036e4506b35e6dfb301d437c95f74b3e1f4f82da5d8841bec894bb8de29ec13';
export function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig autoConnect chains={[sepolia]} connectors={[cartridge as unknown as Connector]} explorer={starkscan} provider={provider}>
      {children}
    </StarknetConfig>
  )
}
const cartridge = new CartridgeConnector({
  policies: [
    {
      target: ACTIONS_ADDRESS,
      method: 'join',
      description: 'Join a new table game.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'start',
      description: 'Start a game once everyone has joined.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'draw',
      description: 'Draw a new card to hand.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'play',
      description: 'Play a card on the board.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'move',
      description: 'Organize the card placements on your own board.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'pay_fee',
      description: 'Pay a gas fee to recipient.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'end_turn',
      description: 'End the current players turn.',
    },
    {
      target: ACTIONS_ADDRESS,
      method: 'leave',
      description: 'Leave the current table game.',
    },
  ],
  url: 'https://x.cartridge.gg',
  rpc: 'https://api.cartridge.gg/x/starknet/sepolia',
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