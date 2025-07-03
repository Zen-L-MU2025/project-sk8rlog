import { useState } from 'react'
import { Routes, Route, BrowserRouter, Link } from "react-router"

import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import Home from './main/HomePage/Home'
import Profile from './main//ProfilePage/Profile'
import Posts from './main/Posts'

import UserContext from '/src/utils/UserContext.js'
import { CLIPS, BLOGS } from '/src/utils/constants'

import './App.css'

function App() {

  const [activeUser, setActiveUser] = useState({})

  return (<>
    <UserContext.Provider value={{ activeUser, setActiveUser }}>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginModal />} />

        <Route path='/register' element={<RegisterModal />} />

        <Route path='/home' element={<Home />} />

        <Route path='/profile' element={<Profile />} />

        <Route path='/clips' element={<Posts postType={CLIPS} />} />

        <Route path='/blogs' element={<Posts postType={BLOGS} />} />

        <Route path='/unauthorized' element={<>
          <p>Snaked! <em>(401 Unauthorized)</em></p>
          <p>Unable to verify access, please sign back in.</p>
          <Link to='/'>Go Back</Link>
        </> } />

        <Route path='*' element={ <>
          <p>Bailed! <em>(404 Not Found)</em></p>
          <Link to='/home'>Go Home</Link>
        </> } />

      </Routes>
    </BrowserRouter>

    </UserContext.Provider>
  </>)
}

export default App
