import { useRef } from 'react'

import { CLIPS, BLOGS } from '/src/utils/constants'

import '/src/css/postCard.css';

const PostCard = ({ post, postType }) => {
    const embedRef = useRef(null)

    const onEnter = () => {
        embedRef.current.play()
    }
    const onLeave = () => {
        embedRef.current.currentTime = 0
        embedRef.current.pause()
    }

    if (!post) {
        console.error('Post failed to load')
        return
    }

    return (
        <article className={`${postType}PostCard`}>
            { postType === CLIPS &&
                <video ref={embedRef} className={`${postType}PostCardEmbed`} src={post.fileURL}
                    muted onMouseEnter={onEnter} onMouseLeave={onLeave}
                />
            }
            { postType === BLOGS &&
                <img className={`${postType}PostCardEmbed`} src={post.fileURL} alt={post.title} />
            }
            <p>{post.description}</p>
        </article>
    )
}

export default PostCard;
