import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { handleLoginOrRegister } from "/src/utils/userUtils/userAccessUtils.js";
import { LOCATIONS } from "/src/utils/constants.js";

import "/src/css/landingModal.css";

const RegisterModal = () => {
    const navigate = useNavigate();
    const [isSuccessful, setIsSuccessful] = useState(null);

    useEffect(() => {
        isSuccessful && navigate("/home");
    }, [isSuccessful]);

    const handleForm = async (formData) => {
        await handleLoginOrRegister(formData, "register", setIsSuccessful);
    };

    return (
        <>
            <header>
                <h1>Sk8rlog</h1>
            </header>

            <form className="landingModal" action={handleForm}>
                <h2>Let's get started...</h2>
                <input type="text" name="name" placeholder="Name (optional)" />
                <input type="text" name="username" placeholder="New Username (required)" required />
                <input type="password" name="password" placeholder="New Password (required)" required />
                <select name="location" defaultValue={LOCATIONS.DEFAULT}>
                    <option value={LOCATIONS.DEFAULT}>Location (optional)</option>
                    <option value={LOCATIONS.MIA}>Miami</option>
                    <option value={LOCATIONS.SEA}>Seattle</option>
                    <option value={LOCATIONS.SFO}>San Francisco</option>
                    <option value={LOCATIONS.LAX}>Los Angeles</option>
                    <option value={LOCATIONS.NYC}>New York</option>
                </select>
                <button type="submit">Register</button>
                <Link to="/"> I already have an account </Link>
                {isSuccessful === false && <p className="error">Something went wrong, please try registering again</p>}
            </form>
        </>
    );
};

export default RegisterModal;
