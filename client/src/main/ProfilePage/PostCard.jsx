import '/src/css/postCard.css';

const PostCard = ({ postType }) => {
    return (
        <article className={`${postType}PostCard`}>
            <h3>Title</h3>
            <p>Content</p>
        </article>
    )
}

export default PostCard;
