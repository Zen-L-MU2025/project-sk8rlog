import "/src/css/notifications.css";

const NotificationsModal = ({ toggleNotifications, notificationBell, isShowingNotifications, notifications, formatNotification }) => {
    return (
        <div className="notificationsContainer">
            <img className="notificationsToggle" onClick={toggleNotifications} src={notificationBell} />
            {isShowingNotifications && (
                <>
                    <div className="notifications">
                        <p className="notifcationModalExit" onClick={toggleNotifications}>
                            ❌
                        </p>
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
