import { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router";

import { deletePost, waitForGCSToFinish } from "/src/utils/postUtils/postDataUtils";
import { handleLikeOrUnlikePost } from "/src/utils/postUtils/postInteractionUtils";

import UserContext from "/src/utils/UserContext";
import { CLIPS, BLOGS, LIKE, UNLIKE, PROFILE_ORIGIN_NOT_APPLICABLE } from "/src/utils/constants";
import { PROFILE_ORIGIN } from "/src/utils/constants";

import "/src/css/postCard.css";
import trash from "/src/assets/trash.png";
import emptyheart from "/src/assets/heart.png";
import fullheart from "/src/assets/heartFull.png";

const PostCard = ({ post, postType, origin, profileID = PROFILE_ORIGIN_NOT_APPLICABLE, setUserPosts, isSelfProfile = false }) => {
    const { activeUser, setActiveUser } = useContext(UserContext);

    const embedRef = useRef(null);

    const [fileIsLoaded, setFileIsLoaded] = useState(false);

    const wait = async () => {
        await waitForGCSToFinish(post.fileURL, setFileIsLoaded);
    };

    const onEnter = () => {
        embedRef.current.play();
    };
    const onLeave = () => {
        embedRef.current.currentTime = 0;
        embedRef.current.pause();
    };

    const handleDeletePost = (event) => {
        event.preventDefault();
        deletePost(post, setUserPosts);
    };

    const handleHeartClick = (event, action) => {
        handleLikeOrUnlikePost(event, post, action, activeUser, setActiveUser);
    };

    useEffect(() => {
        if (!fileIsLoaded) {
            wait();
        }
    }, []);

    if (!post) {
        console.error("Post failed to load");
        return;
    }

    if (!fileIsLoaded) {
        return (
            <article className={`${postType}PostCard`}>
                <p>Loading...</p>
            </article>
        );
    }

    return (
        <Link to={`/${origin}/${profileID}/post/${post.postID}`} className="postRedirect">
            <article className={`${postType}PostCard`}>
                {postType === CLIPS && (
                    <video
                        ref={embedRef}
                        className={`${postType}PostCardEmbed`}
                        src={post.fileURL}
                        muted
                        onMouseEnter={onEnter}
                        onMouseLeave={onLeave}
                    />
                )}
                {postType === BLOGS && <img className={`${postType}PostCardEmbed`} src={post.fileURL} alt={post.title} />}
                <p>{post.description}</p>

                {activeUser?.likedPosts?.includes(post.postID) ? (
                    <img className="likeButton" src={fullheart} onClick={(event) => handleHeartClick(event, UNLIKE)} />
                ) : (
                    <img className="likeButton" src={emptyheart} onClick={(event) => handleHeartClick(event, LIKE)} />
                )}

                {origin === PROFILE_ORIGIN && isSelfProfile && (
                    <img className="deletePostButton" src={trash} onClick={handleDeletePost} alt="trash icon" />
                )}
            </article>
        </Link>
    );
};

export default PostCard;
