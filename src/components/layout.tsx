import { Layout } from './dom/Layout'
import './global.css'
import Header from './ui/Header'
import Footer from './ui/Footer'

export const metadata = {
  title: 'zKTT Demo & MVP | SN HH BKK 2024',
  description: 'Built with love.',
}

// Client wrapper component to handle Starknet and wallet providers
// This needs to be client-side only due to wallet interactions
const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  // Dynamic imports to ensure client-side only execution
  const { StarknetProvider } = require('../controller/StarknetProvider')
  const { WalletProvider } = require('../controller/WalletContext')

  return (
    <StarknetProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </StarknetProvider>
  )
}

// Root layout component that wraps the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body>
        <ClientProviders>
          <Header />
          <main>
            <Layout>{children}</Layout>
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}