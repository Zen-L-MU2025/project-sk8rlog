import { useState } from 'react'
import { Link } from 'react-router'

import skateboard from '/src/assets/skateboard.png'

import '/src/css/header.css'

const Header = ({ HEADER_TEXT }) => {

    const [isIconOverlayOpen, setIsIconOverlayOpen] = useState(false)
    const toggleIconOverlay = () => {
        setIsIconOverlayOpen(!isIconOverlayOpen)
    }

    return (
        <header className="mainHeader">
            <Link to='/home'> <img className='logo' src={skateboard} alt="skateboard" /> </Link>
            <h1>{HEADER_TEXT}</h1>
            <Link to='/profile'> <button className='toProfile'>My Sk8rlog</button> </Link>
            <img className='profilePic' onClick={toggleIconOverlay} src={skateboard} alt='skateboard' />
            { isIconOverlayOpen &&
                <div className='iconOverlay'>
                    <button>Settings</button>
                    <button>Log Out</button>
                </div>
            }
        </header>
    )
}

export default Header
