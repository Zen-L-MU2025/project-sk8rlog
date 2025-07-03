import { useState, useEffect } from 'react'
import { Link } from 'react-router';

import PostCard from '/src/main/PostCard'

import { HOME_PAGE_POST_COUNT } from '/src/utils/constants'
import  { getAllPostsByType } from '/src/utils/postUtils'

import '/src/css/home.css'

const HomePostsView = ({ activeUser, postType }) => {
    const postType_lowercase = postType.toLowerCase()

    const [posts, setPosts] = useState([])

    const loadPosts = async () => {
        await getAllPostsByType(postType, setPosts)
    }

    useEffect( () => {
        loadPosts()
    }, [])

    return(<>
        <div id={`home_${postType_lowercase}`} className="column" >

            <Link to={`/${postType_lowercase}`}>
                <h3 className="columnHeader">{postType}</h3>
            </Link>

            <div id={`${postType_lowercase}ColumnContent`} className="columnContent" >
                {
                    posts.slice(0, HOME_PAGE_POST_COUNT).map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={postType}/>
                        )
                    })
                }
            </div>

        </div>
    </>)
}

export default HomePostsView
