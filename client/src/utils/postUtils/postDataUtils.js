const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { NEW_POST } from "/src/utils/constants.js";
import axios from "axios";

// Uploads a post, starting with the file attachment to GCS and then the full post data to server
// Updates user's posts array state when complete
export const uploadPost = async (postType, formData, user, socket) => {
    const textContent = await formData.get("textContent");
    const file = await formData.get("postFile");

    let fileFormData = await new FormData();
    await fileFormData.append("postFile", file);

    let fileURL = "";

    await axios
        .post(`${baseUrl}/posts/uploadFile`, fileFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
            fileURL = res.data.fileURL;
        })
        .catch((error) => {
            console.error("uploadFile error: ", error);
        });

    // Create the post in DB and fire socket event to trigger post notification
    await axios
        .post(`${baseUrl}/posts/create/${user.userID}`, { textContent, location: user.location, postType, fileURL })
        .then((res) => {
            const post = res.data.post;
            post["authorIdentifier"] = user.name || `@${user.username}`;
            socket.emit(NEW_POST, post);
        })
        .catch((error) => {
            console.error("createPost error: ", error);
        });
};

// Provided a postID, deletes the post and updates the user's posts array state
export const deletePost = async (post, setUserPosts) => {
    const postIDtoDelete = post.postID;
    const fileURL = post.fileURL;

    await axios
        .delete(`${baseUrl}/posts/delete/${postIDtoDelete}`)
        .then(() => {
            setUserPosts((userPosts) => userPosts.filter((post) => post.postID !== postIDtoDelete));
        })
        .catch((error) => {
            console.error("deletePost/DB error: ", error);
        });

    await axios.delete(`${baseUrl}/posts/deleteFile`, { data: { fileURL } }).catch((error) => {
        console.error("deletePost/File: ", error);
    });
};

// Timeout for GCS to finish uploading file
export const waitForGCSToFinish = async (fileURL, setFileIsLoaded) => {
    const fetchInterval = 500;

    const checkForFile = async () => {
        try {
            // Use HEAD to prevent download
            const res = await fetch(fileURL, { method: "HEAD" }).catch((error) => {
                /* Do nothing, keep trying */
            });
            if (res.ok) {
                setFileIsLoaded(true);
                return;
            }
        } catch (error) {
            /* Do nothing, keep trying */
        }

        setTimeout(() => {
            return checkForFile();
        }, fetchInterval);
    };

    return await checkForFile();
};
