import PostCard from './PostCard'

import '/src/css/profilePostView.css'

const ProfilePostView = ({ isViewingClips, isViewingBlogs }) => {
    const CLIPS = "clips"
    const BLOGS = "blogs"

    const type = isViewingClips ? CLIPS : BLOGS

    return (<>
        <section className="profilePostsView">
            { isViewingClips && <>
                <PostCard postType={CLIPS} />
                <PostCard postType={CLIPS} />
                <PostCard postType={CLIPS} />
                <PostCard postType={CLIPS} />
                <PostCard postType={CLIPS} />
            </>}

            { isViewingBlogs && <>
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
                <PostCard postType={BLOGS} />
            </>}
        </section>
    </>)
}

export default ProfilePostView
