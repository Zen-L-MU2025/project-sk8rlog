import cron from "node-cron";
import { CRON_INTERVAL_STRING, CRON_INTERVAL_DESCRIPTOR } from "../constants.js";
import getUsersToNotify from "./getUsersToNotify.js";
import notifyUsers from "./notifyUsers.js";

const requestNotificationScheduling = (socketServer) => {
    console.log(`Cron generated - running a task every ${CRON_INTERVAL_DESCRIPTOR}`);

    cron.schedule(CRON_INTERVAL_STRING, async () => {
        await fireNotifications(socketServer);
    });
};

// Gets users to notify and pushes notifications to them
const fireNotifications = async (socketServer) => {
    const now = new Date();
    const usersToNotify = await getUsersToNotify(now);
    if (usersToNotify.length > 0) {
        notifyUsers(usersToNotify, socketServer);
    }
};

export default requestNotificationScheduling;
