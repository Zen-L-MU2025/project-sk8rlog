import { CLIPS, BLOGS } from '/src/utils/constants'

import '/src/css/postCard.css';

const PostCard = ({ post, postType }) => {
    if (!post) return (
        <article className={`${postType}PostCard`}>
            <p>No post data found! This is a dummy card.</p>
        </article>
    )

    return (
        <article className={`${postType}PostCard`}>
            { postType === CLIPS &&
                <video className={`${postType}PostCardEmbed`} src={post.fileURL} />
            }
            { postType === BLOGS &&
                <img className={`${postType}PostCardEmbed`} src={post.fileURL} alt={post.title} />
            }
            <p>{post.description}</p>
        </article>
    )
}

export default PostCard;
