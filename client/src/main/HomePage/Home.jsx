import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import Header from '/src/main/Header'
import Home_News from './Home_News'
import Home_Clips from './Home_Clips'
import Home_Blogs from './Home_Blogs'
import Footer from '/src/main/Footer'

import { WEEKDAYS } from '/src/utils/constants'
import * as user from '/src/utils/userUtils'

import '/src/css/home_main.css'

const Home = () => {
    const navigate = useNavigate()

    const [hasAccess, setHasAccess] = useState(null)

    useEffect( () => {
        user.verifyAccess(setHasAccess)
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
            <Home_Clips />
            <Home_Blogs />
        </section>

        <p className='scrollNote' id='footerNote'><em>Scroll up to see Clips!</em></p>

        <Footer />

    </>)
}

export default Home
