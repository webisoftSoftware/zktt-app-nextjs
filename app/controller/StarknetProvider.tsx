import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider } from 'starknet'

import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'

const ACTIONS_ADDRESS='0x0325ecc3d1a06d3868685a82290148d2cce41221e2fe87d71a6451fec77b3d3c';
const GAME_ADDRESS='0x076f8d509dac11e7db93304f89b3c13fecef38b92c9b77f46f610e67051aebc5';
const PLAYER_ADDRESS='0x0533bb2f5c1d6fcb65adc8960b9a0f80a8b2d6c3020bbb9691710e7ab69a0e6d';

export function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig 
    autoConnect 
    chains={[sepolia]} 
    connectors={[cartridge]} 
    explorer={starkscan} 
    provider={provider}>
      {children}
    </StarknetConfig>
  )
}
const cartridge = new ControllerConnector({
  policies: [
    // ACTIONS_ADDRESS policies
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
    // GAME_ADDRESS policies
    {
      target: GAME_ADDRESS,
      method: 'start',
      description: 'Start a game once everyone has joined.',
    },
    {
      target: GAME_ADDRESS,
      method: 'end_turn',
      description: 'End the current players turn.',
    },
    // PLAYER_ADDRESS policies
    {
      target: PLAYER_ADDRESS,
      method: 'join',
      description: 'Join a new table game.',
    },
    {
      target: PLAYER_ADDRESS,
      method: 'leave',
      description: 'Leave the current table game.',
    },
  ],
  url: 'https://x.cartridge.gg',
  rpc: 'https://api.cartridge.gg/x/starknet/sepolia',
  //rpc: 'http://0.0.0.0:5050',
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