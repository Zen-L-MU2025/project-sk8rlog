import Home_NewsCard from './Home_NewsCard'

import '/src/css/home_main.css'

const Home_News = () => {
    return(<>
        <div id='home_news' className="column" >

            <h3 className="columnHeader">News</h3>
            <div className="columnContent">

                <Home_NewsCard />
                <Home_NewsCard />
                <Home_NewsCard />
                <Home_NewsCard />

            </div>

        </div>
    </>)
}

export default Home_News
