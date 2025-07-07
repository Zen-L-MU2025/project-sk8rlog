import { useRef } from 'react'
import { Link } from 'react-router'

import { deletePost } from '/src/utils/postUtils'

import { CLIPS, BLOGS } from '/src/utils/constants'
import { PROFILE_ORIGIN } from '/src/utils/constants'

import '/src/css/postCard.css';
import trash from '/src/assets/trash.png';

const PostCard = ({ post, postType, origin, setUserPosts }) => {
    const embedRef = useRef(null)

    const onEnter = () => {
        embedRef.current.play()
    }
    const onLeave = () => {
        embedRef.current.currentTime = 0
        embedRef.current.pause()
    }

    const handleDeletePost = (event) => {
        event.preventDefault()
        deletePost(post, setUserPosts)
    }

    if (!post) {
        console.error('Post failed to load')
        return
    }

    return (
        <Link to={`/${origin}/post/${post.postID}`} className='postRedirect'>
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

            { origin === PROFILE_ORIGIN &&
                <img className='deletePostButton' src={trash} onClick={handleDeletePost} alt='trash icon' />
            }

        </article>
        </Link>
    )
}

export default PostCard;
