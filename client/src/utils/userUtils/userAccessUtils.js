const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";
import { OPTIONS } from "../constants.js";
import { setCookies, locateCookie } from "../cookieUtils.js";

// Handle login/register submission
export const handleLoginOrRegister = async (formData, submissionType, setIsSuccessful) => {
    const formObject = Object.fromEntries([...formData]);

    switch (submissionType) {
        case OPTIONS.LOGIN:
            await login(formObject, setIsSuccessful);
            break;

        case OPTIONS.REGISTER:
            await register(formObject, setIsSuccessful);
            break;

        default:
            console.error("Invalid type for handleLoginRegister");
    }
};

// Handle registration: store token and new user in session storage on completion
const register = async (formObject, setIsSuccessful) => {
    let token, newUserID;

    await axios
        .post(`${baseUrl}/users/register`, { formObject, withCredentials: true })
        .then(async (res) => {
            setIsSuccessful(res.data.isSuccessful);

            const newUserData = res.data.newUser;
            // No need to store password in session
            delete newUserData.password;

            const newUser = JSON.stringify(newUserData);
            sessionStorage.setItem("user", newUser);

            token = res.data.token;
            newUserID = newUserData.userID;

            // Set session cookies
            await setCookies(token, newUserID, setIsSuccessful);
        })
        .catch((error) => {
            console.error("register error: ", error);
            setIsSuccessful(false);
        });
};

// Handle login: store token and user in session storage on completion
const login = async (formObject, setIsSuccessful) => {
    let token, userID;

    await axios
        .post(`${baseUrl}/users/login`, { formObject, withCredentials: true })
        .then(async (res) => {
            setIsSuccessful(res.data.isSuccessful);

            const userData = res.data.user;
            // No need to store password in session
            delete userData.password;

            const user = JSON.stringify(userData);
            sessionStorage.setItem("user", user);

            token = res.data.token;
            userID = userData.userID;

            // Set session cookies
            await setCookies(token, userID, setIsSuccessful);
        })
        .catch((error) => {
            console.error("login error: ", error);
            setIsSuccessful(false);
            return;
        });
};

export const logout = async () => {
    const userID = locateCookie("userid");

    sessionStorage.clear();
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
        // Arbitrarily older date that will force the cookie to instantenously expire
        document.cookie = cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1984; path=/";
    });

    await axios.post(`${baseUrl}/users/logout`, { userID, withCredentials: true }).catch((error) => {
        console.error("logout error: ", error);
    });
};
