import { useState, useEffect } from 'react'

import PostCard from '/src/main/PostCard'

import  { getUserPostsByType } from '/src/utils/PostUtils'

import '/src/css/profile.css'

const ProfilePostView = ({ activeUser, profileContentView }) => {
    const [userPosts, setUserPosts] = useState([])

    const [ isReady, setIsReady ] = useState(false)
    useEffect(() => {
        // TODO Sample implementation, not functional yet
        getUserPostsByType(activeUser, profileContentView, setUserPosts)
        setIsReady(true)
    }, [])

    if (!isReady) return (<p>Loading posts...</p>)

    if (isReady) return (<>
        <section className="profilePostsView">
                {
                    userPosts.map(post => {
                        return (
                            <PostCard key={post.postID} postContent={post} postType={profileContentView}/>
                        )
                    })
                }
        </section>
    </>)
}

export default ProfilePostView
