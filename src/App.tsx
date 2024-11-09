import { Layout } from './components/dom/Layout'
import Header from './components/ui/Header'
import Footer from './components/ui/Footer'
import GameCanvas from './components/canvas/GameCanvas'
import { StarknetProvider } from './components/controller/StarknetProvider'
import { WalletProvider } from './components/controller/WalletContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <StarknetProvider>
        <WalletProvider>
          <Header />
          <Routes>
            <Route path="/" element={
              <Layout>
                <GameCanvas />
              </Layout>
            } />
            {/* Add other routes as needed */}
          </Routes>
          <Footer />
        </WalletProvider>
      </StarknetProvider>
    </Router>
  )
}

export default App