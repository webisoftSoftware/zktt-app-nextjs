import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Header from '../src/components/ui/Header'
import Footer from '../src/components/ui/Footer'

export const metadata = {
  title: 'zKTT Demo & MVP | SN HH BKK 2024',
  description: 'Built with love.',
}

// Create a client wrapper component
const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const { StarknetProvider } = require('@/controller/StarknetProvider')
  const { WalletProvider } = require('@/context/WalletContext')

  return (
    <StarknetProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </StarknetProvider>
  )
}

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