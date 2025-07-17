import { useState, useEffect } from 'react'

import PostCard from '/src/main/PostCard'

import  { getUserPostsByType } from '/src/utils/postUtils'
import { PROFILE_ORIGIN } from '/src/utils/constants'

import '/src/css/profile.css'

const ProfilePostView = ({ activeUser, profileContentView, userPosts, setUserPosts, isOutdated, setIsOutdated }) => {

    const [ isReadyToDisplayContent, setIsReadyToDisplayContent ] = useState(false)

    useEffect(() => {
        if (!activeUser.userID) return
        getUserPostsByType(activeUser, profileContentView, setUserPosts)
        setIsReadyToDisplayContent(true)
    }, [profileContentView, activeUser])

    useEffect(() => {
        if (isOutdated) {
            setIsReadyToDisplayContent(false)
            getUserPostsByType(activeUser, profileContentView, setUserPosts)
            setIsReadyToDisplayContent(true)
            setIsOutdated(false)
        }
    }, [isOutdated])

    if (!isReadyToDisplayContent) {
        return (<p>Loading posts...</p>)
    }

    return (<>
        <section className="profilePostsView">
                { userPosts.length === 0 &&
                    <p>You haven't posted any {profileContentView} yet!</p>
                }

                { userPosts.length > 0 &&
                    userPosts.map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={profileContentView} origin={PROFILE_ORIGIN}
                                setUserPosts={setUserPosts}
                            />
                        )
                    })
                }
        </section>
    </>)
}

export default ProfilePostView
