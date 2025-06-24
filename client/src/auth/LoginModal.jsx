import { Link } from 'react-router';

import '../css/landingModal.css';

const LoginModal = ({handleSubmit}) => {
    return (
        <form className='landingModal' action={(formData) => handleSubmit(formData, "login")}>
            <h1>Welcome back!</h1>
            <input type='text' name='username' placeholder='Username' required />
            <input type='text' name='password' placeholder='Password' required />
            <button type='submit'>Log In</button>
            <Link to='/register'> I want to create a new account </Link>
        </form>
    )
}

export default LoginModal;
