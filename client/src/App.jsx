import { useState } from 'react'
import { Routes, Route, BrowserRouter, Link } from "react-router"

import LoginModal from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'

import './App.css'

import * as user from './utils/userUtils'

function App() {

  // Handle login/register submission
  const handleSubmit = (formData, submissionType) => {
    const username = formData.get("username"), password = formData.get("password")

    submissionType == user.OPTIONS.LOGIN      && user.login(username, password)
    submissionType == user.OPTIONS.REGISTER   && user.register(username, password)

    if (submissionType != user.OPTIONS.LOGIN && submissionType != user.OPTIONS.REGISTER) {
      console.error("Invalid type for handleSubmit")
    }
  }
  return (<>

    <header>
      <h1>Sk8rlog</h1>
    </header>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginModal handleSubmit={handleSubmit} />} />

        <Route path='/register' element={<RegisterModal handleSubmit={handleSubmit} />} />

        <Route path='*' element={ <>
          <p>Bailed! (404 Not Found)</p>
          <Link to='/'>Go Home</Link>
        </> } />

      </Routes>
    </BrowserRouter>

  </>)
}

export default App
