import { useParams, Link } from 'react-router'

import Header from './Header'
import Footer from './Footer'

const SinglePost = () => {
    const { postID } = useParams()

    const HEADER_TEXT = 'Sk8rlog'

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>
        <p>Post {postID}</p>
        <Link to='/home'>Go Back</Link>
        <Footer />
    </>)
}

export default SinglePost
