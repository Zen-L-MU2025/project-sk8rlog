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

// Handle registration: store token and new user in session storage on completion
export const register = (username, password, setIsSuccessful) => {
    axios.post(`${baseUrl}/users/register`, {username, password, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)

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

// Handle login: store token and user in session storage on completion
export const login = async (username, password, setIsSuccessful) => {
    let token;

    await axios.post(`${baseUrl}/users/login`, {username, password, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)

            const userData = res.data.user
            // No need to store password in session
            delete userData.password
            const user = JSON.stringify(userData)
            sessionStorage.setItem("user", user)

            token = res.data.token
        })
        .catch(error => {
            console.log("login error: ", error)
            setIsSuccessful(false)
            return
        })

        await axios.get(`${baseUrl}/auth/setCookie`, {headers : { 'Authorization' : `Bearer ${token}` }, withCredentials: true})
            .then(res => {
                setIsSuccessful(res.data.isSuccessful)
            })
}

// Verify user access to protected resource
// Sets hasAccess to true if access is verified, false otherwise
export const verifyAccess = (setHasAccess) => {

    // Convert cookie string to array and find the webtoken
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.includes("webtoken"))

    if (!tokenCookie) {
        setHasAccess(false)
        return
    }

    // Split tokenCookie and acquire the value
    const token = tokenCookie.split('=')[1].trim()

    axios.get(`${baseUrl}/auth/verify`, {headers : { 'Authorization' : `Bearer ${token}` }, withCredentials: true})
        .then(res => {
            setHasAccess(res.data.isSuccessful)
        })
        .catch(error => {
            console.error("verifyAccess error: ", error)
            setHasAccess(false)
        })


}
