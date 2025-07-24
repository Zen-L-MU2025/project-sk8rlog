import { useContext } from "react";

import UserContext from "/src/utils/UserContext";
import { handleUserFollowing } from "/src/utils/userUtils/userDataUtils.js";
import { CLIPS, BLOGS, FOLLOW, UNFOLLOW } from "/src/utils/constants";

import skateboard from "/src/assets/skateboard.png";

import "/src/css/profile.css";

const ProfileHead = ({ userToDisplay, setProfileContentView, toggleCreatePostModal }) => {
    const { activeUser, setActiveUser } = useContext(UserContext);

    const isSelfProfile = userToDisplay?.userID === activeUser?.userID;
    const isFollowingUser = activeUser?.followedUsers?.includes(userToDisplay?.userID) ? true : false;
    const action = isFollowingUser ? UNFOLLOW : FOLLOW;
    const followButtonText = isFollowingUser ? "- Unfollow User" : "+ Follow User";

    return (
        <section className="profileHead">
            <div className="profileInfo">
                <img className="profilePicture" src={userToDisplay?.profilePicUrl || skateboard} alt="skateboard" />
                <p>
                    {userToDisplay?.name || ""} <em>{`@${userToDisplay?.username}`}</em>
                </p>
                <p>📍 {userToDisplay?.location || "Location not set"}</p>
                <p>Bio: {userToDisplay?.bio || "No bio provided"}</p>
                {!isSelfProfile && (
                    <button
                        className="followButton"
                        onClick={() => {
                            handleUserFollowing(activeUser, userToDisplay.userID, action, setActiveUser);
                        }}
                    >
                        {followButtonText}
                    </button>
                )}
            </div>
            <div className="contentButtons">
                <p className="contentButton" onClick={() => setProfileContentView(CLIPS)}>
                    {isSelfProfile ? "my" : ""} Clips
                </p>
                <p className="contentButton" onClick={() => setProfileContentView(BLOGS)}>
                    {isSelfProfile ? "my" : ""} Blogs
                </p>
                {isSelfProfile && (
                    <p className="contentButton" onClick={toggleCreatePostModal}>
                        + Create Post
                    </p>
                )}
            </div>
        </section>
    );
};

export default ProfileHead;
