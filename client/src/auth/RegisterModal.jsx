import { Link } from 'react-router';

import '../css/landingModal.css';

const RegisterModal = ({handleSubmit}) => {
    return (
        <form className='landingModal' action={(formData) => handleSubmit(formData, "register")}>
            <h1>Let's get started</h1>
            <input type='text' name='username' placeholder='New Username' required />
            <input type='text' name='password' placeholder='New Password' required />
            <button type='submit'>Register</button>
            <Link to='/'> I already have an account </Link>
        </form>
    )
}

export default RegisterModal;
