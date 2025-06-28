
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import PostCard from '/src/main/ProfilePage/PostCard'

import '/src/css/hasSidebar.css'
import '/src/css/posts.css'

const Posts = ({ postType }) => {
  return (<>
    <Header HEADER_TEXT={`Sk8rlog: ${postType}`}/>

    <section className='pageMain'>
        <Sidebar />
        <section className='postsContent'>
            <form className='postsHeader'>
                <select>
                    <option value='latest'>Latest Content</option>
                    <option value='recommended'>Recommended</option>
                    <option value='popular'>Popular</option>
                    <option value='near'>Near You</option>
                </select>
            </form>
            <div className="posts">
            {
                [...Array(20)].map(i => {
                    return (
                        <PostCard key={i} postType={postType} />
                    )
                })
            }
            </div>
        </section>
    </section>

    <Footer />
  </>)
}

export default Posts
