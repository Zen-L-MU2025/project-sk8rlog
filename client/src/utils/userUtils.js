const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'

// Tracks if landing page submission is login or register
export const OPTIONS = {
    LOGIN : "login",
    REGISTER : "register"
}

export const login = (username, password) => {
    console.log(username, password)
    // stuff will happen here
}

export const register = (username, password) => {
    axios.post(`${baseUrl}/register`, {username, password})
    // stuff will happen here
}
