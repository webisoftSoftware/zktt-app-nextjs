'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount } from '@starknet-react/core'

interface WalletContextType {
  isWalletConnected: boolean
}

const WalletContext = createContext<WalletContextType>({ isWalletConnected: false })

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount()
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  useEffect(() => {
    setIsWalletConnected(!!address)
  }, [address])

  return (
    <WalletContext.Provider value={{ isWalletConnected }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext) 