import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PostCard from "./PostCard";

import UserContext from "/src/utils/UserContext";
import { verifyAccess, refreshUserSession } from "/src/utils/userUtils/userAuthUtils.js";
import { getAllPostsByType } from "/src/utils/postUtils/postRetrievalUtils";
import { POST_ORIGINS, RANKING_MODES } from "/src/utils/constants";

import "/src/css/hasSidebar.css";
import "/src/css/posts.css";

const Posts = ({ postType }) => {
    const { activeUser, setActiveUser } = useContext(UserContext);
    const loadUser = async () => {
        await refreshUserSession(setActiveUser);
    };

    const [hasAccess, setHasAccess] = useState(null);
    const [isReadyToDisplayContent, setIsReadyToDisplayContent] = useState(false);
    const [posts, setPosts] = useState(null);
    const [filterState, setFilterState] = useState(RANKING_MODES.RECOMMENDED);

    const navigate = useNavigate();

    const HEADER_TEXT = `Sk8rlog: ${postType}`;

    useEffect(() => {
        loadUser();
        verifyAccess(setHasAccess);
    }, []);

    useEffect(() => {
        hasAccess === false && navigate("/unauthorized");
    }, [hasAccess]);

    useEffect(() => {
        setIsReadyToDisplayContent(false);
        if (activeUser?.userID) {
            getAllPostsByType(postType, setPosts, { scoringMode: filterState, activeUser }, setIsReadyToDisplayContent);
        }
    }, [postType, activeUser?.userID, filterState]);

    const handleFilterChange = (event) => {
        event.preventDefault();
        setFilterState(event.target.value);
    };

    return (
        <>
            <Header HEADER_TEXT={HEADER_TEXT} activeUser={activeUser} />

            <section className="pageMain">
                <Sidebar />
                <section className="postsContent">
                    <form className="postsHeader">
                        <select name="filter" defaultValue={RANKING_MODES.RECOMMENDED} onChange={handleFilterChange}>
                            <option value={RANKING_MODES.RECOMMENDED}>Recommended</option>
                            <option value={RANKING_MODES.LATEST}>Latest Content</option>
                            <option value={RANKING_MODES.POPULAR}>Popular</option>
                            <option value={RANKING_MODES.NEAR_YOU}>Near You</option>
                        </select>
                    </form>

                    <div className="posts">
                        {!isReadyToDisplayContent ? (
                            <p>Loading posts...</p>
                        ) : (
                            posts?.map((post) => {
                                return <PostCard key={post.postID} post={post} postType={postType} origin={POST_ORIGINS[postType]} />;
                            })
                        )}
                    </div>
                </section>
            </section>

            <Footer />
        </>
    );
};

export default Posts;
