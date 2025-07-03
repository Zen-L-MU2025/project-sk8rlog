import { useState } from 'react'
import { Link } from 'react-router'

import skateboard from '/src/assets/skateboard.png'
import gear from '/src/assets/gear.svg'

import '/src/css/header.css'

const Header = ({ HEADER_TEXT }) => {

    const [isIconOverlayOpen, setIsIconOverlayOpen] = useState(false)
    const toggleIconOverlay = () => {
        setIsIconOverlayOpen(!isIconOverlayOpen)
    }

    const handleLogout = () => {
        sessionStorage.clear()
        const cookies = document.cookie.split(';')
        cookies.forEach(cookie => {
            // Arbitrarily older date that will force the cookie to instantenously expire
            document.cookie = cookie.split('=')[0] + '=;expires=Thu, 01 Jan 1984; path=/'
        })
    }

    return (
        <header className="mainHeader">
            <Link to='/home'> <img className='logo' src={skateboard} alt="skateboard" /> </Link>
            <h1>{HEADER_TEXT}</h1>
            <Link to='/profile'> <button className='toProfile' id={`iconOverlayOpen_${isIconOverlayOpen}`}>My Sk8rlog</button> </Link>

            {/* Switch the div nesting of the gear icon so that it's aligned with the buttons when they're visible*/}
            { !isIconOverlayOpen &&
                <img className='gearIcon' onClick={toggleIconOverlay} src={gear} alt='gear icon' />
            }
            { isIconOverlayOpen &&
                <div className='iconOverlay'>
                    <img className='gearIcon' onClick={toggleIconOverlay} src={gear} alt='gear icon' />
                    <button>Settings</button>
                    <Link to='/'><button onClick={handleLogout}>Log Out</button></Link>
                </div>
            }
        </header>
    )
}

export default Header
