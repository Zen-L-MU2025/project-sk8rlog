import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'

import Header from '/src/main/Header'
import HomePostsView from './HomePostsView'
import Footer from '/src/main/Footer'

import UserContext from '/src/utils/UserContext'
import { WEEKDAYS, CLIPS, BLOGS } from '/src/utils/constants'
import { verifyAccess, refreshUserSession } from '/src/utils/UserUtils'

import '/src/css/home.css'

const Home = () => {
    const { activeUser, setActiveUser } = useContext(UserContext)
    const loadUser = async () => { await refreshUserSession(setActiveUser) }

    const[ isReadyToDisplayContent, setIsReadyToDisplayContent ] = useState(false)
    useEffect( () => {
        loadUser()
        setIsReadyToDisplayContent(true)
    }, [])

    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [activeUser])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const userTitle = activeUser.name || `@${activeUser.username}`
    const HEADER_TEXT = `Happy ${WEEKDAYS[new Date().getDay()]}, ${userTitle} !`

    if (!isReadyToDisplayContent) return (<p>Loading home page...</p>)

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT} />

        <h2 className='subHeading'>Today in Sk8rlog</h2>
        <p className='scrollNote'><em>Scroll down to see Blogs!</em></p>

        <section className='columns'>
            <HomePostsView activeUser={activeUser} postType={CLIPS} />
            <HomePostsView activeUser={activeUser} postType={BLOGS} />
        </section>

        <p className='scrollNote' id='footerNote'><em>Scroll up to see Clips!</em></p>

        <Footer />

    </>)
}

export default Home
