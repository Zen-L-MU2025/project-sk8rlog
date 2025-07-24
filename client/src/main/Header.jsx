import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";

import UserContext from "/src/utils/UserContext.js";
import { logout } from "/src/utils/userUtils/userAccessUtils.js";
import { handleNotificationStatuses, formatNotification } from "/src/utils/notificationsUtils.jsx";

import skateboard from "/src/assets/skateboard.png";
import notificationbell from "/src/assets/notificationbell.png";
import gear from "/src/assets/gear.svg";

import "/src/css/header.css";

const Header = ({ HEADER_TEXT, activeUser }) => {
    const { notifications, hasNewNotifications, setHasNewNotifications } = useContext(UserContext);

    const [isIconOverlayOpen, setIsIconOverlayOpen] = useState(false);
    const [isShowingNotifications, setIsShowingNotifications] = useState(false);
    const [notificationBell, setNotificationBell] = useState(notificationbell);

    const toggleIconOverlay = () => {
        setIsIconOverlayOpen(!isIconOverlayOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    const toggleNotifications = async () => {
        setIsShowingNotifications(!isShowingNotifications);
    };

    useEffect(() => {
        handleNotificationStatuses(hasNewNotifications, setHasNewNotifications, isShowingNotifications, setNotificationBell);
    }, [hasNewNotifications, isShowingNotifications]);

    return (
        <header className="mainHeader">
            <Link to="/home">
                {" "}
                <img className="logo" src={skateboard} alt="skateboard" />{" "}
            </Link>
            <h1>{HEADER_TEXT}</h1>

            <Link to={`/profile/${activeUser.userID}`}>
                <button className="toProfile" id={`iconOverlayOpen_${isIconOverlayOpen}`}>
                    My Sk8rlog
                </button>
            </Link>

            <div className="notificationsContainer">
                <img className="notificationsToggle" onClick={toggleNotifications} src={notificationBell} />
                {isShowingNotifications && (
                    <div className="notifications">
                        {notifications?.length ? (
                            notifications.map((notification) => {
                                return formatNotification(notification, toggleNotifications);
                            })
                        ) : (
                            <p>No notifications...</p>
                        )}
                    </div>
                )}
            </div>

            {/* Switch the div nesting of the gear icon so that it's aligned with the buttons when they're visible*/}
            {!isIconOverlayOpen && <img className="gearIcon" onClick={toggleIconOverlay} src={gear} alt="gear icon" />}
            {isIconOverlayOpen && (
                <div className="iconOverlay">
                    <img className="gearIcon" onClick={toggleIconOverlay} src={gear} alt="gear icon" />
                    <Link to="/">
                        <button onClick={handleLogout}>Log Out</button>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
