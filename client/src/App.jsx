import { Routes, Route, BrowserRouter, Link } from "react-router"

import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import Home from './main/HomePage/Home'
import Profile from './main//ProfilePage/Profile'

import './App.css'

function App() {

  return (<>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginModal />} />

        <Route path='/register' element={<RegisterModal />} />

        <Route path='*' element={ <>
          <p>Bailed! (404 Not Found)</p>
          <Link to='/home'>Go Home</Link>
        </> } />

        <Route path='/home' element={<Home />} />

        <Route path='/profile' element={<Profile />} />

      </Routes>
    </BrowserRouter>

  </>)
}

export default App
