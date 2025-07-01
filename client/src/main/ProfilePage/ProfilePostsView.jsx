import PostCard from '/src/main/PostCard'

import '/src/css/profile.css'

const ProfilePostView = ({ profileContentView }) => {

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
