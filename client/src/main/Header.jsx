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
                    <button>Log Out</button>
                </div>
            }
        </header>
    )
}

export default Header
