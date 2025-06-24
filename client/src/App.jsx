import { useState } from 'react'
import { Routes, Route, BrowserRouter, Link } from "react-router"
import './App.css'

import * as user from './utils/userUtils'

function App() {

  // Handle login/register submission
  const handleSubmit = (formData, type) => {
    const username = formData.get("username"), password = formData.get("password")

    type == user.OPTIONS.LOGIN      && user.login(username, password)
    type == user.OPTIONS.REGISTER   && user.register(username, password)

    if (type != user.OPTIONS.LOGIN && type != user.OPTIONS.REGISTER) {
      console.error("Invalid type for handleSubmit")
    }
  }
  return (<>

    <header>
      <h1>Sk8rlog</h1>
    </header>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={
          <form className='landingModal' action={(formData) => handleSubmit(formData, "login")}>
            <h1>Welcome back!</h1>
            <input type='text' name='username' placeholder='Username' required />
            <input type='text' name='password' placeholder='Password' required />
            <button type='submit'>Log In</button>
            <Link to='/register'> I want to create a new account </Link>
          </form>
        } />

        <Route path='/register' element={
          <form className='landingModal' action={(formData) => handleSubmit(formData, "register")}>
            <h1>Let's get started</h1>
            <input type='text' name='username' placeholder='New Username' required />
            <input type='text' name='password' placeholder='New Password' required />
            <button type='submit'>Register</button>
            <Link to='/'> I already have an account </Link>
          </form>
        } />

        <Route path='*' element={ <>
          <p>Bailed! (404 Not Found)</p>
          <Link to='/'>Go Home</Link>
        </> } />

      </Routes>
    </BrowserRouter>

  </>)
}

export default App
