import Home_BlogCard from './Home_BlogCard'

import '/src/css/home_main.css'

const Home_Blogs = () => {
    return(<>
        <div id='home_blogs' className="column" >

            <h3 className="columnHeader">Blogs</h3>
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
