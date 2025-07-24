const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";

// Uploads a post, starting with the file attachment to GCS and then the full post data to server
// Updates user's posts array state when complete
export const uploadPost = async (postType, formData, userID, location) => {
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

    await axios.post(`${baseUrl}/posts/create/${userID}`, { textContent, location, postType, fileURL });
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
