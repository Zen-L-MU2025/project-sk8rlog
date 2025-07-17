import { CLIPS, BLOGS } from '/src/utils/constants'
import skateboard from '/src/assets/skateboard.png'

import '/src/css/profile.css'

const ProfileHead = ({ userToDisplay, activeUser, setProfileContentView, toggleCreatePostModal }) => {
    const isSelfProfile = userToDisplay?.userID === activeUser?.userID

    return (
        <section className="profileHead">
            <div className="profileInfo">
                <img className="profilePicture" src={userToDisplay?.profilePicUrl || skateboard } alt='skateboard' />
                <p>{userToDisplay?.name || ''} <em>{`@${userToDisplay?.username}`}</em></p>
                <p>📍 {userToDisplay?.location || 'Location not set'}</p>
                <p>Bio: {userToDisplay?.bio || 'No bio provided'}</p>
            </div>
            <div className="contentButtons">
                <p className="contentButton" onClick={() => setProfileContentView(CLIPS)}>{isSelfProfile ? 'my' : ''} Clips</p>
                <p className="contentButton" onClick={() => setProfileContentView(BLOGS)}>{isSelfProfile ? 'my' : ''} Blogs</p>
                { isSelfProfile &&
                    <p className="contentButton" onClick={toggleCreatePostModal}>+ Create Post</p>
                }
            </div>
        </section>
    )
}

export default ProfileHead
