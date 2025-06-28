
import { CLIPS, BLOGS } from '/src/utils/constants'
import skateboard from '/src/assets/skateboard.png'

import '/src/css/profile.css'

const ProfileHead = ({ setProfileContentView }) => {

    return (
        <section className="profileHead">
            <div className="profileInfo">
                <img className="profilePicture" src={skateboard} alt='skateboard' />
                <p>Name(?) <em>@username</em></p>
                <p>Location</p>
                <p>About</p>
            </div>
            <div className="contentButtons">
                <p className="contentButton" onClick={() => setProfileContentView(CLIPS)}>(my) Clips</p>
                <p className="contentButton" onClick={() => setProfileContentView(BLOGS)}>(my) Blogs</p>
                <p className="contentButton">+ Create</p>
            </div>
        </section>
    )
}

export default ProfileHead
