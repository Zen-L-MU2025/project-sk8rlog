import { useState } from 'react'

import { CLIPS, BLOGS } from '/src/utils/constants'
import skateboard from '/src/assets/skateboard.png'

import '/src/css/profile.css'

const ProfileHead = ({ activeUser, setProfileContentView, toggleCreatePostModal }) => {
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
            </div>
        </section>
    )
}

export default ProfileHead
