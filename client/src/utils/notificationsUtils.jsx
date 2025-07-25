import notificationbell from "/src/assets/notificationbell.png";
import pendingnotificationbell from "/src/assets/pendingnotificationbell.svg";
import { USER_SUGGESTION, POST_SUGGESTION } from "/src/utils/constants";
import { Link } from "react-router";

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

// Formats an incoming notification into a JSX element to be rendered in the notifications modal
export const formatNotification = (notification, toggleNotifications) => {
    const { recipient, type, data, timestamp } = notification;

    switch (type) {
        case USER_SUGGESTION:
            const candidate = data;
            return (
                <p key={timestamp}>
                    {timestamp} | Hey {recipient}, you might be interested in following&nbsp;
                    <Link to={`/profile/${candidate.userID}`} onClick={toggleNotifications}>
                        {candidate.name || `@${candidate.username}`}
                    </Link>
                    !
                </p>
            );

        // Note: Post notifications are currently not implemented, this is for future reference
        case POST_SUGGESTION:
            const post = data;
            return (
                <p key={timestamp}>
                    {timestamp} | Hey {recipient}, you might be interested in seeing this&nbsp;
                    <Link to={`/h/_/post/${post.postID}`} onClick={toggleNotifications}>
                        post&nbsp;
                    </Link>
                    from {post.authorIdentifier}!
                </p>
            );

        default:
            return <p key={timestamp}>Error getting notification</p>;
    }
};
