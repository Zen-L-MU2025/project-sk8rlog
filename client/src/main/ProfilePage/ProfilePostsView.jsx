import { useState, useEffect } from 'react'

import PostCard from '/src/main/PostCard'

import  { getUserPostsByType } from '/src/utils/postUtils'

import '/src/css/profile.css'

const ProfilePostView = ({ activeUser, profileContentView, userPosts, setUserPosts, isOutdated, setIsOutdated }) => {

    const [ isReadyToDisplayContent, setIsReadyToDisplayContent ] = useState(false)
    useEffect(() => {
        getUserPostsByType(activeUser, profileContentView, setUserPosts)
        setIsReadyToDisplayContent(true)
    }, [profileContentView])

    useEffect(() => {
        const reload = async () => {
            await setIsReadyToDisplayContent(false)
            await getUserPostsByType(activeUser, profileContentView, setUserPosts)
            await setIsReadyToDisplayContent(true)
            await setIsOutdated(false)
        }
        if (isOutdated) reload()
    }, [isOutdated])

    if (!isReadyToDisplayContent) {
        return (<p>Loading posts...</p>)
    }

    if (isReadyToDisplayContent) return (<>
        <section className="profilePostsView">
                { userPosts.length === 0 &&
                    <p>You haven't posted any {profileContentView} yet!</p>
                }

                { userPosts.length > 0 &&
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
