import { useState, useEffect } from "react";

import PostCard from "/src/main/PostCard";

import { getUserPostsByType } from "/src/utils/postUtils/postRetrievalUtils";
import { PROFILE_ORIGIN } from "/src/utils/constants";

import "/src/css/profile.css";

const ProfilePostView = ({ userToDisplay, activeUser, profileContentView, userPosts, setUserPosts, isOutdated, setIsOutdated }) => {
    const [isReadyToDisplayContent, setIsReadyToDisplayContent] = useState(false);

    useEffect(() => {
        if (!userToDisplay?.userID) return;
        setUserPosts([]);
        getUserPostsByType(userToDisplay, profileContentView, setUserPosts);
        setIsReadyToDisplayContent(true);
    }, [profileContentView, userToDisplay]);

    useEffect(() => {
        if (isOutdated) {
            setIsReadyToDisplayContent(false);
            getUserPostsByType(userToDisplay, profileContentView, setUserPosts);
            setIsReadyToDisplayContent(true);
            setIsOutdated(false);
        }
    }, [isOutdated]);

    const isSelfProfile = userToDisplay?.userID === activeUser.userID;

    if (!isReadyToDisplayContent) {
        return <p>Loading posts...</p>;
    }

    return (
        <>
            <section className="profilePostsView">
                {userPosts.length === 0 && <p>No {profileContentView}, yet!</p>}

                {userPosts.length > 0 &&
                    userPosts.map((post) => {
                        return (
                            <PostCard
                                key={post.postID}
                                post={post}
                                postType={profileContentView}
                                origin={PROFILE_ORIGIN}
                                profileID={userToDisplay?.userID}
                                setUserPosts={setUserPosts}
                                isSelfProfile={isSelfProfile}
                            />
                        );
                    })}
            </section>
        </>
    );
};

export default ProfilePostView;
