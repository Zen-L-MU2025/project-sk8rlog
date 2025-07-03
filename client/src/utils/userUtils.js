const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'


// Tracks if landing page submission is login or register
const OPTIONS = {
    LOGIN : "login",
    REGISTER : "register"
}

// Handle login/register submission
export const handleLoginOrRegister = async (formData, submissionType, setIsSuccessful) => {

    const formObject = Object.fromEntries([...formData])

    switch (submissionType) {
        case OPTIONS.LOGIN:
            await login(formObject, setIsSuccessful)
            break

        case OPTIONS.REGISTER:
            await register(formObject, setIsSuccessful)
            break

        default:
            console.error("Invalid type for handleLoginRegister")
    }
}

// Handle registration: store token and new user in session storage on completion
export const register = async (formObject, setIsSuccessful) => {
    let token, newUserID

    await axios.post(`${baseUrl}/users/register`, {formObject, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)

            const newUserData = res.data.newUser
            // No need to store password in session
            delete newUserData.password

            const newUser = JSON.stringify(newUserData)
            sessionStorage.setItem("user", newUser)

            token = res.data.token
            newUserID = newUserData.userID
        })
        .catch(error => {
            console.error("register error: ", error)
            setIsSuccessful(false)
        })

    await axios.get(`${baseUrl}/auth/setCookie`, {headers : { 'Authorization' : `Bearer ${token}:${newUserID}` }, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)
        })
        .catch(error => {
            console.error("setCookie error: ", error)
            setIsSuccessful(false)
            return
        })
}

// Handle login: store token and user in session storage on completion
export const login = async (formObject, setIsSuccessful) => {
    let token, userID

    await axios.post(`${baseUrl}/users/login`, {formObject, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)

            const userData = res.data.user
            // No need to store password in session
            delete userData.password

            const user = JSON.stringify(userData)
            sessionStorage.setItem("user", user)

            token = res.data.token
            userID = userData.userID
        })
        .catch(error => {
            console.error("login error: ", error)
            setIsSuccessful(false)
            return
        })

    await axios.get(`${baseUrl}/auth/setCookie`, {headers : { 'Authorization' : `Bearer ${token}:${userID}` }, withCredentials: true})
        .then(res => {
            setIsSuccessful(res.data.isSuccessful)
        })
        .catch(error => {
            console.error("setCookie error: ", error)
            setIsSuccessful(false)
            return
        })
}

// Verify user access to protected resource
// Sets hasAccess to true if access is verified, false otherwise
export const verifyAccess = (setHasAccess) => {

    const token = locateCookie("webtoken")

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

// Fetch user data to load into session storage
// Sets activeUser to user data if successful, logs error to console otherwise
// This function is only called from protected routes under the assumption that user is already logged in
export const loadUserSession = (setActiveUser) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
        setActiveUser(user)
        return
    }

    const userID = locateCookie("userid")
    if (!userID) {
        console.error("No user ID cookie found")
        return
    }

    axios.get(`${baseUrl}/users/${userID}`, {withCredentials: true})
        .then(res => {
            // No need to store password in session
            delete res.data.user.password
            sessionStorage.setItem("user", JSON.stringify(res.data.user))
            setActiveUser(res.data.user)
        })
        .catch(error => {
            console.error("verifyAccess error: ", error)
        })
}

// Helper function that returns the content of a specified cookie
const locateCookie = (cookieName) => {

    // Convert cookie string to array and find desired cookie
    const cookies = document.cookie.split(';')
    const locatedCookie = cookies.find(cookie => cookie.includes(cookieName))

    if (!locatedCookie) {
        return null
    }

    return locatedCookie.split('=')[1].trim()
}
