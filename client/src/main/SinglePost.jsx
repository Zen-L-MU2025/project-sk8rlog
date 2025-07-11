import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router'

import Header from './Header'
import Footer from './Footer'

import UserContext from '/src/utils/UserContext'
import { getUserByID } from '/src/utils/userUtils'
import { getPostByID, handleLikeOrUnlikePost } from '/src/utils/postUtils'
import { CLIPS, BLOGS, toSingular, ORIGINS, LIKE, UNLIKE } from '/src/utils/constants'

import '/src/css/singlePost.css'
import emptyheart from '/src/assets/heart.png';
import fullheart from '/src/assets/heartFull.png';

const SinglePost = () => {
    const { activeUser, setActiveUser } = useContext(UserContext)
    const { origin, postID } = useParams()
    const HEADER_TEXT = 'Sk8rlog'
    const [post, setPost] = useState(null)
    const [postLikeCount, setPostLikeCount] = useState(0)
    const [postAuthor, setPostAuthor] = useState(null)
    const postDate = new Date(post?.creationDate)
    const postDateFormatted = postDate.toLocaleDateString()

    useEffect(() => {
        getPostByID(postID, setPost)
    }, [])
    useEffect(() => {
        setPostLikeCount(post?.likeCount)
        getUserByID(post?.authorID, setPostAuthor)
    }, [post])

    const handleHeartClick = (event, action) => {
        switch (action) {
            case LIKE:
                setPostLikeCount(prev => prev+1)
                break

            case UNLIKE:
                setPostLikeCount(prev => prev-1)
                break

            default:
                console.error('Invalid action')
        }
        handleLikeOrUnlikePost(event, post, action, activeUser, setActiveUser)
    }

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>
        <div className='singlePostContent'>
            <p>{ toSingular(post?.type) } posted by <em>@{ postAuthor?.username }</em> on {postDateFormatted}</p>
            { post?.type === CLIPS && <video src={post?.fileURL} controls={true} className='singlePostMedia'/>}
            { post?.type === BLOGS && <img src={post?.fileURL} className='singlePostMedia' /> }
            <p>📍 {post?.location}</p>
            <p>{post?.description}</p>
            <p className='likes'>
                {`${postLikeCount} like(s)` }
                { activeUser.likedPosts?.includes(postID) ?
                    <img className='likeButton' src={fullheart} onClick={(event) => handleHeartClick(event, UNLIKE)} />
                    :
                    <img className='likeButton' src={emptyheart} onClick={(event) => handleHeartClick(event, LIKE)} />
                }
            </p>
            <Link to={`/${ORIGINS[origin]}`}>Go Back</Link>
        </div>
        <Footer />
    </>)
}

export default SinglePost
