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
            sessionStorage.setItem("user", res.data.user)
        })
        .catch(error => {
            setIsSuccessful(false)
        })
}

// Handle registration: store token and new user in session storage on completion
export const register = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/register`, {username, password})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)
            sessionStorage.setItem("webtoken", res.data.token)

            const newUser = res.data.newUser
            // No need to store password in session
            newUser.remove("password")
            sessionStorage.setItem("user", newUser)
        })
        .catch(error => {
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

    axios.get(`${baseUrl}/auth/verify`, {headers : { 'Authorization' : `Bearer ${token}` }})
        .then(res => {
            const isSuccessful = res.data.isSuccessful
            if (isSuccessful) {
                setHasAccess(true)
            }
            else {
                setHasAccess(false)
            }
        })
        .catch(error => {
            setHasAccess(false)
        })


}
