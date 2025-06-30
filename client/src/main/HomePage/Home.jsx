import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import Header from '/src/main/Header'
import HomePostsView from './HomePostsView'
import Footer from '/src/main/Footer'

import { WEEKDAYS, CLIPS, BLOGS } from '/src/utils/constants'
import { verifyAccess } from '/src/utils/UserUtils'

import '/src/css/home_main.css'

const Home = () => {
    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        verifyAccess(setHasAccess)
    }, [])

    useEffect( () => {
        hasAccess === false && navigate('/unauthorized')
    }, [hasAccess])

    const HEADER_TEXT = `Happy ${WEEKDAYS[new Date().getDay()]}, User!`

    return (<>
        <Header HEADER_TEXT={HEADER_TEXT} />

        <h2 className='subHeading'>Today in Sk8rlog</h2>
        <p className='scrollNote'><em>Scroll down to see Blogs!</em></p>

        <section className='columns'>
            <HomePostsView postType={CLIPS} />
            <HomePostsView postType={BLOGS} />
        </section>

        <p className='scrollNote' id='footerNote'><em>Scroll up to see Clips!</em></p>

        <Footer />

    </>)
}

export default Home
