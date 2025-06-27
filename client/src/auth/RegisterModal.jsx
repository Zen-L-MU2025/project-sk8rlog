import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import * as user from '/src/utils/userUtils'

import '/src/css/landingModal.css'

const RegisterModal = () => {
    const navigate = useNavigate()
    const [isSuccessful, setIsSuccessful] = useState(null)

    useEffect(() => {
        isSuccessful && navigate('/home')
    }, [isSuccessful])


    const handleForm = async (formData) => {
        user.handleLoginOrRegister(formData, "register", setIsSuccessful)
    }

    return (<>
        <header>
        <h1>Sk8rlog</h1>
        </header>

        <form className='landingModal' action={handleForm}>
            <h2>Let's get started</h2>
            <input type='text' name='username' placeholder='New Username' required />
            <input type='password' name='password' placeholder='New Password' required />
            <button type='submit'>Register</button>
            <Link to='/'> I already have an account </Link>
            {isSuccessful === false && <p className='error'>Something went wrong</p>}
        </form>
    </>)
}

export default RegisterModal
