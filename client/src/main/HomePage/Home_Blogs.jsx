import { Link } from 'react-router';

import Home_BlogCard from './Home_BlogCard'

import '/src/css/home_main.css'

const Home_Blogs = () => {
    return(<>
        <div id='home_blogs' className="column" >

            <Link to="/blogs">
                <h3 className="columnHeader">Blogs</h3>
            </Link>

            <div className="columnContent">

                <Home_BlogCard />
                <Home_BlogCard />
                <Home_BlogCard />
                <Home_BlogCard />

            </div>

        </div>
    </>)
}

export default Home_Blogs
