import { Link } from 'react-router';

import '/src/css/sidebar.css'

const Sidebar = () => {
    return (
        <section className="sidebar">
            <Link to="/home"><button>Home</button></Link>
            <Link to="/clips"><button>Clips</button></Link>
            <Link to="/blogs"><button>Blogs</button></Link>
        </section>
    )
}

export default Sidebar;
