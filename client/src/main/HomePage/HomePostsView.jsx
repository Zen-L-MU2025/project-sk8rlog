import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router';

import PostCard from '/src/main/PostCard'

import UserContext from '/src/utils/UserContext'
import { HOME_PAGE_POST_COUNT, HOME_ORIGIN } from '/src/utils/constants'
import  { getAllPostsByType } from '/src/utils/postUtils'

import '/src/css/home.css'

const HomePostsView = ({ postType }) => {
    const { activeUser } = useContext(UserContext)

    const postTypeLowerCase = postType.toLowerCase()
    const [posts, setPosts] = useState(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect( () => {
        getAllPostsByType(postType, setPosts, { isScoring: true, activeUser })
        setIsInitialized(true)
    }, [])

    if (!isInitialized) return (<p>Loading...</p>)

    return(<>
        <div id={`home_${postTypeLowerCase}`} className="column" >

            <Link to={`/${postTypeLowerCase}`}>
                <h3 className="columnHeader">{postType}</h3>
            </Link>

            <div id={`${postTypeLowerCase}ColumnContent`} className="columnContent" >
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
