import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import PostCard from './PostCard'

import { verifyAccess } from '/src/utils/UserUtils'
import  { getAllPostsByType } from '/src/utils/postUtils'

import '/src/css/hasSidebar.css'
import '/src/css/posts.css'

const Posts = ({ postType }) => {

    const navigate = useNavigate()
    const [hasAccess, setHasAccess] = useState(null)
    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [])
    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const [isReadyToDisplayContent, setIsReadyToDisplayContent] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect( () => {
        setIsReadyToDisplayContent(false)
        getAllPostsByType(postType, setPosts)
        setIsReadyToDisplayContent(true)
    }, [postType])


    const HEADER_TEXT = `Sk8rlog: ${postType}`

    if (!isReadyToDisplayContent) return (<p>Loading posts...</p>)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>

        <section className='pageMain'>
            <Sidebar />
            <section className='postsContent'>
                <form className='postsHeader'>
                    <select name='filter'>
                        <option value='latest'>Latest Content</option>
                        <option value='recommended'>Recommended</option>
                        <option value='popular'>Popular</option>
                        <option value='near'>Near You</option>
                    </select>
                </form>

                <div className="posts">
                {
                    posts.map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={postType}/>
                        )
                    })
                }
                </div>
            </section>
        </section>

        <Footer />
    </>)
}

export default Posts
