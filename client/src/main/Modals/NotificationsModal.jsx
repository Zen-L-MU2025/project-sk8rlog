import "/src/css/notifications.css";
import x_icon from "/src/assets/xicon.svg";

const NotificationsModal = ({ toggleNotifications, notificationBell, isShowingNotifications, notifications, formatNotification }) => {
    return (
        <div className="notificationsContainer">
            <img className="notificationsToggle" onClick={toggleNotifications} src={notificationBell} />
            {isShowingNotifications && (
                <>
                    <div className="notifications">
                        <img className="notifcationModalExit" onClick={toggleNotifications} src={x_icon} />
                        {notifications?.length ? (
                            notifications.map((notification) => {
                                return formatNotification(notification, toggleNotifications);
                            })
                        ) : (
                            <p>No notifications...</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationsModal;
