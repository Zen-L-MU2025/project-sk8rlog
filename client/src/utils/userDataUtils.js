const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";
import { FOLLOW, UNFOLLOW } from "./constants.js";

// Finds a user by provided ID and sets corresponding user in state
export const getUserByID = async (userID, setUser) => {
    if (!userID) return;
    await axios
        .get(`${baseUrl}/users/${userID}`, { withCredentials: true })
        .then((res) => {
            // No need to store password in user state
            delete res.data.user.password;
            setUser(res.data.user);
        })
        .catch((error) => {
            console.error("getUserByID error: ", error);
        });
};

// Adds/removes a user from active user's following list
export const handleUserFollowing = async (activeUser, userBeingReferencedID, action, setActiveUser) => {
    await axios
        .put(`${baseUrl}/users/${activeUser.userID}/followedUsers/${action}`, { userBeingReferencedID })
        .then(() => {
            const updatedUser = {
                ...activeUser,
                followedUsers:
                    action === FOLLOW
                        ? [...activeUser.followedUsers, userBeingReferencedID]
                        : activeUser.followedUsers.filter((uID) => uID !== userBeingReferencedID),
            };

            setActiveUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch((error) => {
            console.error(error);
            window.alert(`Failed to ${action} user, please try again.`);
        });
};
