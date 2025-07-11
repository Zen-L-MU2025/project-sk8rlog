import { useRef, useContext } from 'react'
import { Link } from 'react-router'

import { deletePost, handleLikeOrUnlikePost } from '/src/utils/postUtils'

import UserContext from '/src/utils/UserContext'
import { CLIPS, BLOGS, LIKE, UNLIKE } from '/src/utils/constants'
import { PROFILE_ORIGIN } from '/src/utils/constants'

import '/src/css/postCard.css';
import trash from '/src/assets/trash.png';
import emptyheart from '/src/assets/heart.png';
import fullheart from '/src/assets/heartFull.png';

const PostCard = ({ post, postType, origin, setUserPosts }) => {
    const { activeUser, setActiveUser } = useContext(UserContext)

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

    const handleHeartClick = (event, action) => {
        handleLikeOrUnlikePost(event, post, action, activeUser, setActiveUser)
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

            { activeUser?.likedPosts?.includes(post.postID) ?
                <img className='likeButton' src={fullheart} onClick={(event) => handleHeartClick(event, UNLIKE)} />
                :
                <img className='likeButton' src={emptyheart} onClick={(event) => handleHeartClick(event, LIKE)} />
            }

            { origin === PROFILE_ORIGIN &&
                <img className='deletePostButton' src={trash} onClick={handleDeletePost} alt='trash icon' />
            }

        </article>
        </Link>
    )
}

export default PostCard;
