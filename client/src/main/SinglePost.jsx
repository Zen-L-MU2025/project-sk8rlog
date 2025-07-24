import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";

import Header from "./Header";
import Footer from "./Footer";

import UserContext from "/src/utils/UserContext";
import { getUserByID, verifyAccess, refreshUserSession } from "/src/utils/userUtils";
import { getPostByID, handleLikeOrUnlikePost, getComments, createComment } from "/src/utils/postUtils";
import { CLIPS, BLOGS, toSingular, ORIGINS, LIKE, UNLIKE, PROFILE_ORIGIN_NOT_APPLICABLE } from "/src/utils/constants";

import "/src/css/singlePost.css";
import emptyheart from "/src/assets/heart.png";
import fullheart from "/src/assets/heartFull.png";

const SinglePost = () => {
    const { activeUser, setActiveUser } = useContext(UserContext);
    const { origin, profileID, postID } = useParams();

    const [hasAccess, setHasAccess] = useState(null);
    const [post, setPost] = useState(null);
    const [postLikeCount, setPostLikeCount] = useState(0);
    const [postAuthor, setPostAuthor] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentBoxContent, setCommentBoxContent] = useState("");
    const navigate = useNavigate();

    const loadUser = async () => {
        await refreshUserSession(setActiveUser);
    };

    const handleGoToProfile = () => {
        navigate(`/profile/${postAuthor?.userID}`);
    };

    const HEADER_TEXT = "Sk8rlog";
    const postDate = new Date(post?.creationDate);
    const postDateFormatted = postDate.toLocaleDateString();

    useEffect(() => {
        loadUser();
        getPostByID(postID, setPost);
    }, []);

    useEffect(() => {
        verifyAccess(setHasAccess);
        hasAccess === false && navigate("/unauthorized");
    }, [activeUser, hasAccess]);

    useEffect(() => {
        setPostLikeCount(post?.likeCount);
        getUserByID(post?.authorID, setPostAuthor);
        getComments(post?.comments, setComments);
    }, [post]);

    const handleHeartClick = (event, action) => {
        setPostLikeCount((prev) => prev + (action === LIKE ? 1 : -1));
        handleLikeOrUnlikePost(event, post, action, activeUser, setActiveUser);
    };

    const handleCommentBoxChange = (event) => {
        setCommentBoxContent(event.target.value);
    };

    const handleCommentFormSubmit = () => {
        createComment(commentBoxContent, activeUser, postID, setComments);
        setCommentBoxContent("");
    };

    return (
        <>
            <Header HEADER_TEXT={HEADER_TEXT} activeUser={activeUser} />
            <div className="page">
                <section className="singlePost">
                    <div className="singlePostContent">
                        <h3>
                            {toSingular(post?.type)}
                            &nbsp;posted by{" "}
                            <em className="postedBy" onClick={handleGoToProfile}>
                                @{postAuthor?.username}
                            </em>
                            &nbsp;on {postDateFormatted}
                        </h3>
                        <p className="location">📍 {post?.location}</p>
                        {post?.type === CLIPS && <video src={post?.fileURL} controls={true} className="singlePostMedia" />}
                        {post?.type === BLOGS && <img src={post?.fileURL} className="singlePostMedia" />}
                        <p>{post?.description}</p>
                        <p className="likes">
                            {`${postLikeCount} like${postLikeCount !== 1 ? "s" : ""} `}
                            {activeUser.likedPosts?.includes(postID) ? (
                                <img className="likeButton" src={fullheart} onClick={(event) => handleHeartClick(event, UNLIKE)} />
                            ) : (
                                <img className="likeButton" src={emptyheart} onClick={(event) => handleHeartClick(event, LIKE)} />
                            )}
                        </p>
                    </div>

                    <div className="singlePostComments">
                        <h3>Comments</h3>
                        <div className="commentsBox">
                            {comments?.length === 0 && <p>None, yet!</p>}

                            {comments?.length > 0 &&
                                comments?.map((comment) => {
                                    return (
                                        <article className="comment" key={comment.commentID}>
                                            <p className="commentDate">
                                                {new Date(comment.creationDate).toLocaleDateString()}&nbsp;
                                                {new Date(comment.creationDate).toLocaleTimeString()}
                                            </p>
                                            <p className="commentContent">
                                                <em>@{comment.author.username}</em>: {comment.content}
                                            </p>
                                        </article>
                                    );
                                })}
                        </div>

                        <form className="addCommentBox" action={handleCommentFormSubmit}>
                            <input
                                className="commentInput"
                                type="text"
                                placeholder="Add a comment!"
                                value={commentBoxContent}
                                onChange={handleCommentBoxChange}
                            />
                            <button type="submit">Post</button>
                        </form>
                    </div>
                </section>

                <Link to={`/${ORIGINS[origin]}/${profileID !== PROFILE_ORIGIN_NOT_APPLICABLE ? profileID : ""}`}>
                    <p className="goBackButton">Go Back</p>
                </Link>
            </div>
            <Footer />
        </>
    );
};

export default SinglePost;
