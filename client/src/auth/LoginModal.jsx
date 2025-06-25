import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';

import * as user from '../utils/userUtils'

import '../css/landingModal.css';

const LoginModal = () => {
    const navigate = useNavigate();
    const [isSuccessful, setIsSuccessful] = useState(null);

    useEffect(() => {
        isSuccessful && navigate('/home')
    }, [isSuccessful])

    const handleForm = async (formData) => {
        user.handleLoginRegister(formData, "login", setIsSuccessful)
    }

    return (
        <form className='landingModal' action={handleForm}>
            <h1>Welcome back!</h1>
            <input type='text' name='username' placeholder='Username' required />
            <input type='password' name='password' placeholder='Password' required />
            <button type='submit' onSubmit={(event) => event.preventDefault()}>Log In</button>
            <Link to='/register'> I want to create a new account </Link>
            {isSuccessful === false && <p>Invalid username or password</p>}
        </form>
    )
}

export default LoginModal;
