'use client'

import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider } from 'starknet'

import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'


// hard coded contract address temporary
const ACTIONS_ADDRESS='0x009c4382dc6a6e9813dfe097dc5f8bedabaa94ba19c1ea073c9d903f224a9784';
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