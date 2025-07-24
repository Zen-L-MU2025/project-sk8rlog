const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";

// Verify user access to protected resource
// Sets hasAccess to true if access is verified, false otherwise
export const verifyAccess = (setHasAccess) => {
    const token = locateCookie("webtoken");

    if (!token) {
        setHasAccess(false);
        return;
    }

    axios
        .get(`${baseUrl}/auth/verify`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
        .then((res) => {
            setHasAccess(res.data.isSuccessful);
        })
        .catch((error) => {
            console.error("verifyAccess error: ", error);
            setHasAccess(false);
        });
};

// Fetch user data to load into session storage
// Sets activeUser to user data if successful, logs error to console otherwise
// This function is only called from protected routes under the assumption that user is already logged in
export const refreshUserSession = async (setActiveUser) => {
    const token = locateCookie("webtoken");
    const userID = locateCookie("userid");

    if (!userID || !token) {
        console.error("No user session found");
        return;
    }

    // Refresh cookies
    await setCookies(token, userID);

    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        setActiveUser(user);
        return;
    }

    const res = await axios.get(`${baseUrl}/users/${userID}`, { withCredentials: true }).catch((error) => {
        console.error("verifyAccess error: ", error);
    });

    // No need to store password in session
    delete res.data.user.password;
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
    setActiveUser(res.data.user);
};
