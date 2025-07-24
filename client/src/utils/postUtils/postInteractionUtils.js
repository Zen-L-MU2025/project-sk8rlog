const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";
import tokenize from "../clientPostRecommendationUtils.js";
import { LIKE, UNLIKE } from "../constants.js";

// Handles data related to liking/unliking a post
export const handleLikeOrUnlikePost = async (event, post, action, activeUser, setActiveUser) => {
    event.preventDefault();

    switch (action) {
        case LIKE:
            likePost(post, activeUser, setActiveUser);
            break;

        case UNLIKE:
            unlikePost(post, activeUser, setActiveUser);
            break;

        default:
            console.error("Invalid handleLikeOrUnlike action");
    }
};

// add postID to user's likedPosts array, update user's frequency object, increment post's like count
const likePost = async (post, activeUser, setActiveUser) => {
    const postID = post.postID;
    const updatedUserFrequency = await tokenize(post, activeUser, LIKE);

    const updatedUser = {
        ...activeUser,
        likedPosts: activeUser.likedPosts ? [...activeUser.likedPosts, postID] : [postID],
        user_Frequency: updatedUserFrequency,
    };

    setActiveUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    await axios.put(`${baseUrl}/users/${activeUser.userID}/likedPosts/like`, { postID, updatedUserFrequency }).catch((error) => {
        console.error("likePost error: ", error);
    });

    await axios.put(`${baseUrl}/posts/${postID}/likes/increment`).catch((error) => {
        console.error("likePost error: ", error);
    });
};

// remove postID from user's likedPosts array, update user's frequency object, decrement post's like count
const unlikePost = async (post, activeUser, setActiveUser) => {
    const postID = post.postID;
    const updatedUserFrequency = await tokenize(post, activeUser, UNLIKE);

    const updatedUser = {
        ...activeUser,
        likedPosts: activeUser?.likedPosts?.filter((pID) => pID !== postID),
        user_Frequency: updatedUserFrequency,
    };

    setActiveUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    await axios.put(`${baseUrl}/users/${activeUser.userID}/likedPosts/unlike`, { postID, updatedUserFrequency }).catch((error) => {
        console.error("unlikePost error: ", error);
    });

    await axios.put(`${baseUrl}/posts/${postID}/likes/decrement`).catch((error) => {
        console.error("unlikePost error: ", error);
    });
};

// Creates a comment in DB and adds it to the comments array state
export const createComment = async (commentBoxContent, activeUser, postID, setComments) => {
    const userID = activeUser.userID;
    await axios
        .post(`${baseUrl}/posts/comments/${postID}`, { commentBoxContent, userID })
        .then((res) => {
            setComments((comments) => [res.data.comment, ...comments]);
        })
        .catch((error) => {
            console.error("createComment error: ", error);
        });
};
