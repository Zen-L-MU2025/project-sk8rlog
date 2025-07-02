import { useState, useEffect } from 'react'

import PostCard from '/src/main/PostCard'

import  { getUserPostsByType } from '/src/utils/PostUtils'

import '/src/css/profile.css'

const ProfilePostView = ({ activeUser, profileContentView }) => {
    const [userPosts, setUserPosts] = useState([])
    useEffect(() => {
        // TODO Sample implementation, not functional yet
        getUserPostsByType(activeUser, profileContentView, setUserPosts)
    }, [])

    return (<>
        <section className="profilePostsView">
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
                <PostCard postType={profileContentView} />
        </section>
    </>)
}

export default ProfilePostView
