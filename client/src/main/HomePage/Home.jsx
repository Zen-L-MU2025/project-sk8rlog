
import Header from '/src/main/Header'
import Home_News from './Home_News'
import Home_Clips from './Home_Clips'
import Home_Blogs from './Home_Blogs'
import Footer from '/src/main/Footer'

import { WEEKDAYS } from '/src//utils/weekdays'

import '/src/css/home_main.css'

const Home = () => {
    const headerText = `Happy ${WEEKDAYS[new Date().getDay()]}, User!`

    return (<>
        <Header headerText={headerText} />

        <h2 className='subHeading'>Today in Sk8rlog</h2>

        <section className='columns'>
            <Home_News />
            <Home_Clips />
            <Home_Blogs />
        </section>

        <Footer />

    </>)
}

export default Home
