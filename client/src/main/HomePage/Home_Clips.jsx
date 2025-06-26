import Home_ClipCard from './Home_ClipCard'

import '/src/css/home_main.css'

const Home_Clips = () => {
    return(<>
        <div id='home_clips' className="column" >

            <h3 className="columnHeader">Clips</h3>

            <div id='clipsColumnContent' className="columnContent" >

                <Home_ClipCard />
                <Home_ClipCard />
                <Home_ClipCard />
                <Home_ClipCard />

            </div>

        </div>
    </>)
}

export default Home_Clips
