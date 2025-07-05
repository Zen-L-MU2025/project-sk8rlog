import { useParams, Link } from 'react-router'

const SinglePost = () => {
    const { postID } = useParams()

    return (<>
        <p>Post {postID}</p>
        <Link to='/home'>Go Back</Link>
    </>)
}

export default SinglePost
