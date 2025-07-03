import { useState, useEffect } from 'react'

import PostCard from '/src/main/PostCard'

import  { getUserPostsByType } from '/src/utils/postUtils'

import '/src/css/profile.css'

const ProfilePostView = ({ activeUser, profileContentView, userPosts, setUserPosts, isOutdated, setIsOutdated }) => {

    const [ isReady, setIsReady ] = useState(false)
    useEffect(() => {
        getUserPostsByType(activeUser, profileContentView, setUserPosts)
        setIsReady(true)
    }, [profileContentView])

    useEffect(() => {
        const reload = async () => {
            await setIsReady(false)
            await getUserPostsByType(activeUser, profileContentView, setUserPosts)
            await setIsReady(true)
            await setIsOutdated(false)
        }
        if (isOutdated) reload()
    }, [isOutdated])

    if (!isReady) {
        return (<p>Loading posts...</p>)
    }

    if (isReady) return (<>
        <section className="profilePostsView">
                {
                    userPosts.map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={profileContentView}/>
                        )
                    })
                }
        </section>
    </>)
}

export default ProfilePostView
