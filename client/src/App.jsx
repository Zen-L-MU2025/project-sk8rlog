import { Routes, Route, BrowserRouter, Link } from "react-router"

import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import Home from './main/Home'

import './App.css'

function App() {

  return (<>

    <header>
      <h1>Sk8rlog</h1>
    </header>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginModal />} />

        <Route path='/register' element={<RegisterModal />} />

        <Route path='*' element={ <>
          <p>Bailed! (404 Not Found)</p>
          <Link to='/'>Go Home</Link>
        </> } />

        <Route path='/home' element={<Home />} />

      </Routes>
    </BrowserRouter>

  </>)
}

export default App
