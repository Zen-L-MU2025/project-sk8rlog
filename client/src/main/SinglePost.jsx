import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'

import Header from './Header'
import Footer from './Footer'

import { getUserByID } from '/src/utils/userUtils'
import { getPostByID } from '/src/utils/postUtils'
import { CLIPS, BLOGS, toSingular, ORIGINS } from '/src/utils/constants'

import '/src/css/singlePost.css'

const SinglePost = () => {
    const { origin, postID } = useParams()
    const HEADER_TEXT = 'Sk8rlog'
    const [post, setPost] = useState(null)
    const [postAuthor, setPostAuthor] = useState(null)

    useEffect(() => {
        getPostByID(postID, setPost)
    }, [])
    useEffect(() => {
        getUserByID(post?.authorID, setPostAuthor)
    }, [post])

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>
        <p>{ toSingular(post?.type) } posted by <em>@{ postAuthor?.username }</em> on { post?.creationDate }</p>
        { post?.type === CLIPS && <video src={post?.fileURL} controls={true} className='singlePostMedia'/>}
        { post?.type === BLOGS && <img src={post?.fileURL} className='singlePostMedia' /> }
        <p>📍 {post?.location}</p>
        <p>{post?.description}</p>
        <p>{post?.likeCount} likes</p>
        <Link to={`/${ORIGINS[origin]}`}>Go Back</Link>
        <Footer />
    </>)
}

export default SinglePost
