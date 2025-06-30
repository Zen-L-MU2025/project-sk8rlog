const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'

// Tracks if landing page submission is login or register
export const OPTIONS = {
    LOGIN : "login",
    REGISTER : "register"
}

// Handle login/register submission
export const handleLoginOrRegister = (formData, submissionType, setIsSuccessful) => {
    const username = formData.get("username"), password = formData.get("password")

    switch (submissionType) {
        case OPTIONS.LOGIN:
            login(username, password, setIsSuccessful)
            break

        case OPTIONS.REGISTER:
            register(username, password, setIsSuccessful)
            break

        default:
            console.error("Invalid type for handleLoginRegister")
    }
}

// Handle login: store token and user in session storage on completion
export const login = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/login`, {username, password})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)
            sessionStorage.setItem("webtoken", res.data.token)

            const userData = res.data.user
            // No need to store password in session
            delete userData.password
            const user = JSON.stringify(userData)
            sessionStorage.setItem("user", user)
        })
        .catch(error => {
            console.log("login error: ", error)
            setIsSuccessful(false)
        })
}

// Handle registration: store token and new user in session storage on completion
export const register = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/register`, {username, password})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)
            sessionStorage.setItem("webtoken", res.data.token)

            const newUserData = res.data.newUser
            // No need to store password in session
            delete newUserData.password
            const newUser = JSON.stringify(newUserData)
            sessionStorage.setItem("user", newUser)
        })
        .catch(error => {
            console.log("register error: ", error)
            setIsSuccessful(false)
        })
}

// Verify user access to protected resource
// Sets hasAccess to true if access is verified, false otherwise
export const verifyAccess = (setHasAccess) => {

    const token = sessionStorage.getItem("webtoken")

    if (!token) {
        setHasAccess(false)
        return
    }

    axios.get(`${baseUrl}/auth/verify`, {headers : { 'Authorization' : `Bearer ${token}` }, withCredentials: true})
        .then(res => {
            setHasAccess(res.data.isSuccessful)
        })
        .catch(error => {
            console.error("verifyAccess error: ", error)
            setHasAccess(false)
        })


}
