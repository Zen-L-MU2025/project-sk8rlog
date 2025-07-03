import { Link } from 'react-router';

import PostCard from '/src/main/PostCard'

import '/src/css/home.css'

const HomePostsView = ({ postType }) => {
    const postType_lowercase = postType.toLowerCase()

    return(<>
        <div id={`home_${postType_lowercase}`} className="column" >

            <Link to={`/${postType_lowercase}`}>
                <h3 className="columnHeader">{postType}</h3>
            </Link>

            <div id={`${postType_lowercase}ColumnContent`} className="columnContent" >

                <PostCard postType={postType} />
                <PostCard postType={postType} />
                <PostCard postType={postType} />

            </div>

        </div>
    </>)
}

export default HomePostsView
