import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'

import Header from './Header'
import Footer from './Footer'

import { getPostByID } from '/src/utils/postUtils'
import { CLIPS, BLOGS } from '/src/utils/constants'


const SinglePost = () => {
    const { postID } = useParams()
    const HEADER_TEXT = 'Sk8rlog'
    const [post, setPost] = useState(null)

    useEffect(() => {
        getPostByID(postID, setPost)
    })

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>
        { post?.type === CLIPS && <video src={post?.fileURL} controls={true}></video>}
        { post?.type === BLOGS && <img src={post?.fileURL} /> }
        <p>{post?.creationDate}</p>
        <p>{post?.description}</p>
        <p>{post?.location}</p>
        <p>{post?.type}</p>
        <p>{post?.likeCount}</p>
        <Link to='/home'>Go Back</Link>
        <Footer />
    </>)
}

export default SinglePost
