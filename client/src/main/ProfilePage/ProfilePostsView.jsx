import PostCard from './PostCard'

import { CLIPS, BLOGS } from '/src/utils/constants'

import '/src/css/profile.css'

const ProfilePostView = ({ isViewingClips, isViewingBlogs }) => {

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
