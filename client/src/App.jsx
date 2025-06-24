import { useState } from 'react'
import { Routes, Route, BrowserRouter, Link } from "react-router"
import './App.css'

function App() {

  return (<>

    <header>
      <h1>Sk8rlog</h1>
    </header>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={
          <form className='landingModal'>
            <h1>Welcome back!</h1>
            <input type='text' name='identifier' placeholder='Username or (not) Email' required />
            <input type='text' name='password' placeholder='Password' required />
            <button type='submit'>Log In</button>
            <Link to='/register'> I want to create a new account </Link>
          </form>
        } />

        <Route path='/register' element={
          <form className='landingModal'>
            <h1>Let's get started</h1>
            <input type='text' name='identifier' placeholder='Email (inactive)' readonly='true' />
            <input type='text' name='identifier' placeholder='Username' required />
            <input type='text' name='password' placeholder='Password' required />
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
