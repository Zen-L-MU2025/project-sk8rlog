import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router'

import UserContext from '/src/utils/UserContext.js'
import { handleLoginOrRegister} from '/src/utils/UserUtils'

import '/src/css/landingModal.css'

const RegisterModal = () => {
    const { setActiveUser } = useContext(UserContext)

    const navigate = useNavigate()
    const [isSuccessful, setIsSuccessful] = useState(null)

    useEffect(() => {
        isSuccessful && navigate('/home')
    }, [isSuccessful])

    const handleForm = async (formData) => {
        handleLoginOrRegister(formData, "register", setIsSuccessful, setActiveUser)
    }

    return (<>
        <header>
        <h1>Sk8rlog</h1>
        </header>

        <form className='landingModal' action={handleForm}>
            <h2>Let's get started...</h2>
            <input type='text' name='name' placeholder='Name (optional)' />
            <input type='text' name='username' placeholder='New Username (required)' required />
            <input type='password' name='password' placeholder='New Password (required)' required />
            <input type='text' name='location' placeholder='Location (optional)' />
            <button type='submit'>Register</button>
            <Link to='/'> I already have an account </Link>
            {isSuccessful === false && <p className='error'>Something went wrong</p>}
        </form>
    </>)
}

export default RegisterModal
