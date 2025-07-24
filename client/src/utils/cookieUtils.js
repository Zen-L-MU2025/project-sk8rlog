const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";

// Helper function that returns the content of a specified cookie
export const locateCookie = (cookieName) => {
    // Convert cookie string to array and find desired cookie
    const cookies = document.cookie.split(";");
    const locatedCookie = cookies.find((cookie) => cookie.includes(cookieName));

    if (!locatedCookie) {
        return null;
    }

    return locatedCookie.split("=")[1].trim();
};

// Refreshes cookies
export const setCookies = async (token, userID, setIsSuccessful = null) => {
    await axios
        .get(`${baseUrl}/auth/setCookie`, { headers: { Authorization: `Bearer ${token}:${userID}` }, withCredentials: true })
        .then((res) => {
            if (setIsSuccessful) setIsSuccessful(res.data.isSuccessful);
        })
        .catch((error) => {
            console.error("setCookie error: ", error);
            if (setIsSuccessful) setIsSuccessful(false);
            return;
        });
};
