import notificationbell from "/src/assets/notificationbell.png";
import pendingnotificationbell from "/src/assets/pendingnotificationbell.svg";

// Updates new notification statuses based on whether the notifications modal is open
export const handleNotificationStatuses = (hasNewNotifications, setHasNewNotifications, isShowingNotifications, setNotificationBell) => {
    if (!hasNewNotifications) return;

    if (!isShowingNotifications) {
        setNotificationBell(pendingnotificationbell);
    }

    if (isShowingNotifications) {
        setNotificationBell(notificationbell);
        setHasNewNotifications(false);
    }
};
