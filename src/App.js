import './App.css'
import Home from './pages/Home'
import Staking from './pages/Staking'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"
import { useState } from 'react';
function App() {
  const [wallet, setWallet] = useState(localStorage.getItem('wallet'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setWallet={setWallet}/>} />
        <Route path="/staking" element={<Staking  wallet={wallet} />}/>
      </Routes>
    </Router>
  )
}

export default App
