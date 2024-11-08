import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Header from '../src/components/ui/Header'
import Footer from '../src/components/ui/Footer'

export const metadata = {
  title: 'zKTT Demo & MVP | SN HH BKK 2024',
  description: 'Built with love.',
}

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="grow">
            <Layout>{children}</Layout>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}