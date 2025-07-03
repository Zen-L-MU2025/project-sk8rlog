import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router'

import CreatePostModal from '/src/main/Modals/CreatePostModal'
import Header from '/src/main/Header'
import Sidebar from '/src/main/Sidebar'
import ProfileHead from './ProfileHead'
import ProfilePostsView from './ProfilePostsView'
import Footer from '/src/main/Footer'

import UserContext from '/src/utils/UserContext'
import { CLIPS } from '/src/utils/constants'
import { verifyAccess, loadUserSession } from '/src/utils/UserUtils'

import '/src/css/hasSidebar.css'
import '/src/css/profile.css'

const Profile = () => {
    const [showCreatePostModal, setShowCreatePostModal] = useState(false)
    const toggleCreatePostModal = () => setShowCreatePostModal(!showCreatePostModal)

    const { activeUser, setActiveUser } = useContext(UserContext)

    const [userPosts, setUserPosts] = useState([])
    const [isOutdated, setIsOutdated] = useState(false)

    const[ isReadyToDisplayContent, setIsReadyToDisplayContent ] = useState(false)
    useEffect( () => {
        const loadUser = async () => { await loadUserSession(setActiveUser) }
        loadUser()
        setIsReadyToDisplayContent(true)
    }, [])

    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const userTitle = activeUser.name || `@${activeUser.username}`
    const HEADER_TEXT = `${userTitle}'s Profile`

    const [profileContentView, setProfileContentView] = useState(CLIPS)

    if (!isReadyToDisplayContent) return (<p>Loading profile...</p>)

    if (isReadyToDisplayContent) return (<>
        <Header HEADER_TEXT={HEADER_TEXT} />
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
