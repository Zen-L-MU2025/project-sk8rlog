import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router'

import CreatePostModal from '/src/main/Modals/CreatePostModal'
import Header from '/src/main/Header'
import Sidebar from '/src/main/Sidebar'
import ProfileHead from './ProfileHead'
import ProfilePostsView from './ProfilePostsView'
import Footer from '/src/main/Footer'

import UserContext from '/src/utils/UserContext'
import { CLIPS } from '/src/utils/constants'
import { verifyAccess, refreshUserSession } from '/src/utils/UserUtils'

import '/src/css/hasSidebar.css'
import '/src/css/profile.css'

const Profile = () => {
    const { userID } = useParams()

    const { activeUser, setActiveUser } = useContext(UserContext)
    const loadUser = async () => { await refreshUserSession(setActiveUser) }

    const [hasAccess, setHasAccess] = useState(null)
    const [showCreatePostModal, setShowCreatePostModal] = useState(false)
    const [userPosts, setUserPosts] = useState([])
    const [isOutdated, setIsOutdated] = useState(false)
    const [profileContentView, setProfileContentView] = useState(CLIPS)
    const[ isReadyToDisplayContent, setIsReadyToDisplayContent ] = useState(false)

    const toggleCreatePostModal = () => setShowCreatePostModal(!showCreatePostModal)
    const navigate = useNavigate()

    const userTitle = activeUser.name || `@${activeUser.username}`
    const HEADER_TEXT = `${userTitle}'s Profile`

    useEffect( () => {
        loadUser()
        setIsReadyToDisplayContent(true)
    }, [])

    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    if (!isReadyToDisplayContent) return (<p>Loading profile...</p>)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT} activeUser={activeUser} />
        <section className='pageMain'>
            <Sidebar />
            <div className='profileContent'>
                <ProfileHead
                    activeUser={activeUser}
                    setProfileContentView={setProfileContentView}
                    toggleCreatePostModal={toggleCreatePostModal}
                />
                <ProfilePostsView
                    activeUser={activeUser}
                    profileContentView={profileContentView}
                    userPosts={userPosts} setUserPosts={setUserPosts}
                    isOutdated={isOutdated} setIsOutdated={setIsOutdated}
                />
            </div>
        </section>

        { showCreatePostModal &&
            <CreatePostModal
                activeUser={activeUser}
                toggleCreatePostModal={toggleCreatePostModal}
                setIsOutdated={setIsOutdated}
            />
        }

        <Footer />

    </>)
}

export default Profile
