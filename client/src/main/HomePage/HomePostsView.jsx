import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";

import PostCard from "/src/main/PostCard";

import UserContext from "/src/utils/UserContext";
import { HOME_PAGE_POST_COUNT, HOME_ORIGIN, RANKING_MODES } from "/src/utils/constants";
import { getAllPostsByType } from "/src/utils/postUtils/postRetrievalUtils";

import "/src/css/home.css";

const HomePostsView = ({ postType }) => {
    const { activeUser } = useContext(UserContext);

    const postTypeLowerCase = postType.toLowerCase();
    const [posts, setPosts] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (activeUser?.userID) {
            getAllPostsByType(postType, setPosts, { scoringMode: RANKING_MODES.RECOMMENDED, activeUser }, setIsInitialized);
        }
    }, [activeUser]);

    if (!isInitialized) {
        return (
            <div id={`home_${postTypeLowerCase}`} className="column">
                <h3>Loading {postType}...</h3>
            </div>
        );
    }

    return (
        <>
            <div id={`home_${postTypeLowerCase}`} className="column">
                <Link to={`/${postTypeLowerCase}`}>
                    <h3 className="columnHeader">{postType}</h3>
                </Link>
                {posts?.length === 0 ? (
                    <p>No posts to show</p>
                ) : (
                    <div id={`${postTypeLowerCase}ColumnContent`} className="columnContent">
                        {posts?.slice(0, HOME_PAGE_POST_COUNT).map((post) => {
                            return <PostCard key={post.postID} post={post} postType={postType} origin={HOME_ORIGIN} />;
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default HomePostsView;
