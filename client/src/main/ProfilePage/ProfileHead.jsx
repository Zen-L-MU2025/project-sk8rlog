import { useState, useEffect, useContext } from 'react'

import CreatePostModal from '/src/main/Modals/CreatePostModal'

import UserContext from '/src/utils/UserContext'
import { CLIPS, BLOGS } from '/src/utils/constants'
import { loadUserSession } from '/src/utils/userUtils'
import skateboard from '/src/assets/skateboard.png'

import '/src/css/profile.css'

const ProfileHead = ({ setProfileContentView }) => {
    const { activeUser, setActiveUser } = useContext(UserContext)
    useEffect( () => {
        const load = async () => { await loadUserSession(setActiveUser) }
        load()
    }, [])

    const [showCreatePostModal, setShowCreatePostModal] = useState(false)
    const toggleCreatePostModal = () => setShowCreatePostModal(!showCreatePostModal)

    return (
        <section className="profileHead">
            <div className="profileInfo">
                <img className="profilePicture" src={activeUser.profilePicUrl || skateboard } alt='skateboard' />
                <p>{activeUser.name || ''} <em>{`@${activeUser.username}`}</em></p>
                <p>📍 {activeUser.location || 'Location not set'}</p>
                <p>Bio: {activeUser.bio || 'No bio provided'}</p>
            </div>
            <div className="contentButtons">
                <p className="contentButton" onClick={() => setProfileContentView(CLIPS)}>my Clips</p>
                <p className="contentButton" onClick={() => setProfileContentView(BLOGS)}>my Blogs</p>
                <p className="contentButton" onClick={toggleCreatePostModal}>+ Create Post</p>
                { showCreatePostModal &&
                    <CreatePostModal toggleCreatePostModal={toggleCreatePostModal} />
                }
            </div>
        </section>
    )
}

export default ProfileHead
