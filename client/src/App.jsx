import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Dashboard from "./pages/Dashboard.jsx"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
