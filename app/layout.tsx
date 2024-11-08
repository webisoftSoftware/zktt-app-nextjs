import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Header from '../src/components/ui/Header'

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
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <div>
        <Header />
          <Layout>{children}</Layout>
        </div>
      </body>
    </html>
  )
}