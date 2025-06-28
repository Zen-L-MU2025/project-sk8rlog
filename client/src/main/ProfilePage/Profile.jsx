import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'

import Header from '/src/main/Header'
import Sidebar from '/src/main/Sidebar'
import ProfileHead from './ProfileHead'
import ProfilePostsView from './ProfilePostsView'
import Footer from '/src/main/Footer'

import { CLIPS } from '/src/utils/constants'
import * as user from '/src/utils/userUtils'

import '/src/css/hasSidebar.css'
import '/src/css/profile.css'

const Profile = () => {
    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        user.verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const HEADER_TEXT = `User's Profile`

    const [profileContentView, setProfileContentView] = useState(CLIPS)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT} />
        <section className='pageMain'>
            <Sidebar />
            <div className='profileContent'>
                <ProfileHead setProfileContentView={setProfileContentView}/>
                <ProfilePostsView profileContentView={profileContentView} />
            </div>

        </section>

        <Footer />

    </>)
}

export default Profile
