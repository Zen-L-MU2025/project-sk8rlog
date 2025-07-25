import { useState, useContext } from "react";

import UserContext from "/src/utils/UserContext.js";
import { uploadPost } from "/src/utils/postUtils/postDataUtils";
import { CLIPS, BLOGS, POST_TYPE_DEFAULT } from "/src/utils/constants";

import "/src/css/createPostModal.css";

const CreatePostModal = ({ activeUser, toggleCreatePostModal, setIsOutdated }) => {
    const { socket } = useContext(UserContext);

    const [postType, setPostType] = useState(POST_TYPE_DEFAULT);

    const handleForm = async (formData) => {
        await uploadPost(postType, formData, activeUser, socket);
        setIsOutdated(true);
        toggleCreatePostModal();
    };

    const handleSelect = (event) => {
        setPostType(event.target.value);
    };

    return (
        <section id="createPostModal" onClick={toggleCreatePostModal}>
            <form id="createModalContent" onClick={(event) => event.stopPropagation()} action={handleForm}>
                <h2>New Post!</h2>
                <select id="postType" onChange={handleSelect}>
                    <option value={POST_TYPE_DEFAULT}>Select Post Type</option>
                    <option value={CLIPS}>Clip</option>
                    <option value={BLOGS}>Blog</option>
                </select>

                {postType === CLIPS && (
                    <>
                        <div className="upload">
                            <p className="message">Select a clip to upload:</p>
                            <input type="file" id="clip" name="postFile" accept="video/*" required />
                        </div>
                        <input type="text" name="textContent" placeholder="What are we looking at? (50 char. maximum)" maxLength={50} required />
                    </>
                )}

                {postType === BLOGS && (
                    <>
                        <input type="file" id="header" name="postFile" accept="image/*" required />
                        <textarea
                            type="long_text"
                            name="textContent"
                            placeholder="Speak your truth (in 300 char. or less)!"
                            maxLength={300}
                            required
                        />
                    </>
                )}

                {postType !== POST_TYPE_DEFAULT && <button type="submit">Upload</button>}
            </form>
        </section>
    );
};

export default CreatePostModal;
