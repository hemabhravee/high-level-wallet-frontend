import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LayoutView from './components/layout-view'
import { RouteConstants } from './constants/route-constants'
import Transactions from './views/transactions'
import Wallet from './views/wallet/wallet'

function App() {

  return (
    <BrowserRouter>
        <Routes>
        <Route
                path="/"
                element={<Navigate to={RouteConstants.wallet.path} replace />}
            />
            <Route
              path={ RouteConstants.wallet.path }
              element={
                <LayoutView>
                  <Wallet />
                </LayoutView>
              }
            />
            <Route
              path={ RouteConstants.transactions.path }
              element={
                <LayoutView>
                  <Transactions />
                </LayoutView>
              }
            />
          </Routes>
    </BrowserRouter>
  )
}

export default App
