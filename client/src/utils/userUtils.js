const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'


// Tracks if landing page submission is login or register
export const OPTIONS = {
    LOGIN : "login",
    REGISTER : "register"
}

// Handle login/register submission
export const handleLoginRegister = (formData, submissionType, setIsSuccessful) => {
    const username = formData.get("username"), password = formData.get("password")

    submissionType == OPTIONS.LOGIN      && login(username, password, setIsSuccessful)
    submissionType == OPTIONS.REGISTER   && register(username, password, setIsSuccessful)

    if (submissionType != OPTIONS.LOGIN && submissionType != OPTIONS.REGISTER) {
        console.error("Invalid type for handleLoginRegister")
    }
}

export const login = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/login`, {username, password})
        .then(res => {
            console.log("Login successful!")
            setIsSuccessful(res.data.isSuccessful)
        })
        .catch(err => {
            console.log("Login failed!")
            setIsSuccessful(false)
        })
}

export const register = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/register`, {username, password})
        .then(res => {
            console.log("Registration successful!")
            setIsSuccessful(res.data.isSuccessful)
        })
        .catch(err => {
            console.log("Registration failed!")
            setIsSuccessful(false)
        })
}
