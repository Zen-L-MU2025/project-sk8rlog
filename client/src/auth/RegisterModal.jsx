import { useState } from 'react'
import { Link, useNavigate } from 'react-router';

import * as user from '../utils/userUtils'

import '../css/landingModal.css';

const RegisterModal = () => {
    const navigate = useNavigate();
    const [isSuccessful, setIsSuccessful] = useState(null);

    useEffect(() => {
        isSuccessful && navigate('/home')
    }, [isSuccessful])


    const handleForm = async (formData) => {
        user.handleLoginRegister(formData, "register", setIsSuccessful)
    }

    return (
        <form className='landingModal' action={handleForm}>
            <h1>Let's get started</h1>
            <input type='text' name='username' placeholder='New Username' required />
            <input type='password' name='password' placeholder='New Password' required />
            <button type='submit'>Register</button>
            <Link to='/'> I already have an account </Link>
            {isSuccessful === false && <p>Something went wrong</p>}
        </form>
    )
}

export default RegisterModal;
