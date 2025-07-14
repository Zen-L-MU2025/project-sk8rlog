import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'

import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import PostCard from './PostCard'

import UserContext from '/src/utils/UserContext'
import { verifyAccess, loadUserSession } from '/src/utils/UserUtils'
import  { getAllPostsByType } from '/src/utils/postUtils'
import { POSTS, RECOMMENDED, LATEST, POPULAR, NEAR_YOU } from '/src/utils/constants'

import '/src/css/hasSidebar.css'
import '/src/css/posts.css'

const Posts = ({ postType }) => {
    const { activeUser, setActiveUser } = useContext(UserContext)
    const loadUser = async () => { await loadUserSession(setActiveUser) }

    const [hasAccess, setHasAccess] = useState(null)
    const [isReadyToDisplayContent, setIsReadyToDisplayContent] = useState(false)
    const [posts, setPosts] = useState(null)
    const [filterState, setFilterState] = useState(RECOMMENDED)

    const navigate = useNavigate()

    const HEADER_TEXT = `Sk8rlog: ${postType}`

    useEffect( () => {
        loadUser()
        verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    useEffect( () => {
        setIsReadyToDisplayContent(false)
        getAllPostsByType(postType, setPosts, { isScoring: true, activeUser })
        setIsReadyToDisplayContent(true)
    }, [postType, activeUser])

    useEffect( () => {
        switch (filterState) {
            case RECOMMENDED :
                getAllPostsByType(postType, setPosts, { isScoring: true, byPopularity: false, activeUser })
                break

            case POPULAR:
                getAllPostsByType(postType, setPosts, { isScoring: true, byPopularity: true, activeUser })
                break

            // TODO Implement locations
            case NEAR_YOU :
            case LATEST :
                getAllPostsByType(postType, setPosts)
                break

            default :
                console.error("Posts: invalid filer provided")
                getAllPostsByType(postType, setPosts)
        }
    }, [filterState])

    const handleFilterChange = (event) => {
        event.preventDefault()
        setFilterState(event.target.value)
    }

    if (!isReadyToDisplayContent) return (<p>Loading posts...</p>)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT}/>

        <section className='pageMain'>
            <Sidebar />
            <section className='postsContent'>
                <form className='postsHeader'>
                    <select name='filter' defaultValue={RECOMMENDED} onChange={handleFilterChange}>
                        <option value={RECOMMENDED}>Recommended</option>
                        <option value={LATEST}>Latest Content</option>
                        <option value={POPULAR}>Popular</option>
                        <option value={NEAR_YOU}>Near You</option>
                    </select>
                </form>

                <div className="posts">
                { filterState !== POPULAR &&
                    posts?.map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={postType} origin={POSTS[postType]} />
                        )
                    })
                }
                { filterState === POPULAR &&
                    posts?.toSorted((a,b) => b.popularity - a.popularity).map(post => {
                        return (
                            <PostCard key={post.postID} post={post} postType={postType} origin={POSTS[postType]} />
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
