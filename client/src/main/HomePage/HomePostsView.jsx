import { useState, useEffect, useContext, act } from 'react'
import { Link } from 'react-router';

import PostCard from '/src/main/PostCard'

import UserContext from '/src/utils/UserContext'
import { HOME_PAGE_POST_COUNT, HOME_ORIGIN } from '/src/utils/constants'
import  { getAllPostsByType } from '/src/utils/postUtils'
import { scorePosts } from '/src/utils/recUtils'

import '/src/css/home.css'

const HomePostsView = ({ postType }) => {
    const { activeUser } = useContext(UserContext)

    const postType_lowercase = postType.toLowerCase()
    const [posts, setPosts] = useState(null)

    useEffect( () => {
        getAllPostsByType(postType, setPosts)
    }, [])
    useEffect( () => {
        scorePosts(posts, activeUser)
    }, [posts])

    return(<>
        <div id={`home_${postType_lowercase}`} className="column" >

            <Link to={`/${postType_lowercase}`}>
                <h3 className="columnHeader">{postType}</h3>
            </Link>

            <div id={`${postType_lowercase}ColumnContent`} className="columnContent" >
                {
                    posts?.slice(0, HOME_PAGE_POST_COUNT).map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={postType} origin={HOME_ORIGIN} />
                        )
                    })
                }
            </div>

        </div>
    </>)
}

export default HomePostsView
