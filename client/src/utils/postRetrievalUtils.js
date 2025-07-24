const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";
import { RANKING_MODES } from "./constants.js";

// Provided a userID, gets all posts for that user by specified postType and sets the userPosts array state
export const getUserPostsByType = async (activeUser, postType, setUserPosts) => {
    await axios
        .get(`${baseUrl}/posts/by/${activeUser.userID}/${postType}`)
        .then((res) => {
            if (!res.data.posts) return;
            setUserPosts(res.data.posts.toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate)));
        })
        .catch((error) => {
            console.error("getUserPostsByType error: ", error);
        });
};

// Gets all posts by specified postType and sets the posts array state
// If scoringPayload is provided, will score the posts for the provided user and set the posts array state
export const getAllPostsByType = async (
    postType,
    setPosts,
    scoringPayload = { scoringMode: RANKING_MODES.DEFAULT, activeUser: null },
    setIsInitialized
) => {
    const { scoringMode, activeUser } = scoringPayload;

    await axios
        .post(`${baseUrl}/posts/all/${postType}/${scoringMode}`, { activeUser })
        .then((res) => {
            setPosts(res.data.posts);
        })
        .catch((error) => {
            console.error("getAllPostsByType error: ", error);
        });

    setIsInitialized(true);
    return;
};

// Provided a postID, gets the post data
// Sets the single post state if a setter is provided, otherwise just returns the post
export const getPostByID = async (postID, setPost = null) => {
    const res = await axios.get(`${baseUrl}/posts/single/${postID}`);
    try {
        if (setPost !== null) {
            setPost(res.data.post);
        } else {
            return res.data.post;
        }
    } catch (error) {
        console.error("getPostByID error: ", error);
    }
};

// Provided any number of commentIDs, gets the comments' data and sets the comments array state
export const getComments = async (commentIDs, setComments) => {
    // Why have I not done this before
    if (!commentIDs?.length) return;

    await axios
        .post(`${baseUrl}/posts/comments`, { commentIDs })
        .then((res) => {
            setComments(res.data.comments);
        })
        .catch((error) => {
            console.error("getComments error: ", error);
        });
};
