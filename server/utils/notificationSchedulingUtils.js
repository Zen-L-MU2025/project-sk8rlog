import cron from "node-cron";
import { toSecondOfDay } from "./sessionUtils.js";
import {
    CONNECTION,
    DISCONNECT,
    DELIVER_NOTIFICATION,
    CRON_INTERVAL_STRING,
    CRON_INTERVAL_DESCRIPTOR,
    HALF_HOUR_IN_SECONDS,
    MIDDLE_OF_DAY_IN_SECONDS,
} from "./constants.js";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const requestNotificationScheduling = (socketServer) => {
    console.log(`Cron generated - running a task every ${CRON_INTERVAL_DESCRIPTOR}`);

    socketServer.on(CONNECTION, (socket) => {
        cron.schedule(CRON_INTERVAL_STRING, async () => {
            await fireNotifications(socket);
        });

        socket.on(DISCONNECT, () => {
            console.log("notiSched utils: connection terminated");
        });
    });
};

// Gets users to notify and pushes notifications to them
const fireNotifications = async (socket) => {
    const now = new Date();
    const noNotificationsMessage = `No one to notify at ${now.toLocaleTimeString()}`;
    const usersToNotify = await getUsersToNotify(now);

    usersToNotify.length ? notifyUsers(usersToNotify, socket) : socket.emit(DELIVER_NOTIFICATION, noNotificationsMessage);
};

// Calculates users' best notification times and queues them to be notified if it falls within the cron job window
const getUsersToNotify = async (now) => {
    const nowAsSecondOfDay = toSecondOfDay(now);
    const halfHourBefore = nowAsSecondOfDay - HALF_HOUR_IN_SECONDS;
    const halfHourAfter = nowAsSecondOfDay + HALF_HOUR_IN_SECONDS;

    const users = await prisma.user.findMany();

    // Iterate users and calculate best times
    for (const user of users) {
        delete user.password;
        const sessionData = await prisma.sessionData.findUnique({ where: { userID: user.userID } });
        // const interactionData = await prisma.interactionData.find({ where: { userID: user.userID } });

        // Default user's best time to midday if they have no session logged
        if (sessionData.sessionCount === 0) {
            user["bestTime"] = MIDDLE_OF_DAY_IN_SECONDS;
        } else {
            user["bestTime"] = Math.ceil(sessionData.averageSessionStartTime + sessionData.averageSessionTime / 2);
        }
    }

    // Filter out users whose best time fall out the hour window
    let notifiableUsers = users.filter((u) => {
        return u.bestTime >= halfHourBefore && u.bestTime < halfHourAfter;
    });

    return notifiableUsers;
};

// Grab top candidate for each user lined up and emit the notification through the WebSocket
const notifyUsers = async (usersToNotify, socket) => {
    for (const user of usersToNotify) {
        let topCandidate;

        // Acquire candidates and pick out top candidate (first in array)
        const res = await fetch(`http://localhost:3000/recommendations/acquireCandidates/for/${user.userID}`).catch((error) => {
            console.log(error);
        });
        const candidates = await res.json();
        topCandidate = candidates[0];

        const suggestionMessage = `For @${user.username}: You might be interested in @${topCandidate.username}`;
        socket.emit(DELIVER_NOTIFICATION, `${suggestionMessage} | ${new Date().toLocaleTimeString()}`);
    }
};
