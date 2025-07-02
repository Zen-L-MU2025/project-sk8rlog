import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router'

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
    const { activeUser, setActiveUser } = useContext(UserContext)
    useEffect( () => {
        const load = async () => { await loadUserSession(setActiveUser) }
        load()
    }, [])

    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const user_title = activeUser.name ? activeUser.name : `@${activeUser.username}`
    const HEADER_TEXT = `${user_title}'s Profile`

    const [profileContentView, setProfileContentView] = useState(CLIPS)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT} />
        <section className='pageMain'>
            <Sidebar />
            <div className='profileContent'>
                <ProfileHead activeUser={activeUser} setProfileContentView={setProfileContentView}/>
                <ProfilePostsView activeUser={activeUser} profileContentView={profileContentView} />
            </div>

        </section>

        <Footer />

    </>)
}

export default Profile
