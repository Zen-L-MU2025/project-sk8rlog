
import skateboard from '/src/assets/skateboard.png'

import '/src/css/profileHead.css'

const ProfileHead = ({ toggleContentView }) => {
    const CLIPS = "clips"
    const BLOGS = "blogs"

    return (
        <section className="profileHead">
            <div className="profileInfo">
                <img className="profilePicture" src={skateboard} alt='skateboard' />
                <p>Name(?) <em>@username</em></p>
                <p>Location</p>
                <p>About</p>
            </div>
            <div className="contentButtons">
                <p className="contentButton" onClick={() => toggleContentView(CLIPS)}>(my) Clips</p>
                <p className="contentButton" onClick={() => toggleContentView(BLOGS)}>(my) Blogs)</p>
            </div>
        </section>
    )
}

export default ProfileHead
