import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { handleLoginOrRegister } from "/src/utils/userAccessUtils.js";

import "/src/css/landingModal.css";

const LoginModal = () => {
    const navigate = useNavigate();
    const [isSuccessful, setIsSuccessful] = useState(null);

    useEffect(() => {
        isSuccessful && navigate("/home");
    }, [isSuccessful]);

    const handleForm = async (formData) => {
        await handleLoginOrRegister(formData, "login", setIsSuccessful);
    };

    return (
        <>
            <header>
                <h1>Sk8rlog</h1>
            </header>

            <form className="landingModal" action={handleForm}>
                <h2>Welcome back!</h2>
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" onSubmit={(event) => event.preventDefault()}>
                    Log In
                </button>
                <Link to="/register"> I want to create a new account </Link>
                {isSuccessful === false && <p className="error">Invalid username or password</p>}
            </form>
        </>
    );
};

export default LoginModal;
