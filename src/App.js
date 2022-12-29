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
  const [isMsgVerified, setIsMsgVerified] = useState(sessionStorage.getItem('isMsgVerified'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setWallet={setWallet} setIsMsgVerified={setIsMsgVerified}/>} />
        <Route path="/staking" element={<Staking  wallet={wallet} isMsgVerified={isMsgVerified}  />}/>
      </Routes>
    </Router>
  )
}

export default App
