import cron from "node-cron";
import { toSecondOfDay } from "./sessionUtils.js";
import { DELIVER_NOTIFICATION, CRON_INTERVAL_STRING, CRON_INTERVAL_DESCRIPTOR, HALF_HOUR_IN_SECONDS, MIDDLE_OF_DAY_IN_SECONDS } from "./constants.js";
import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const requestNotificationScheduling = (socketServer) => {
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

// Calculates users' best notification times and queues them to be notified if it falls within the cron job window
const getUsersToNotify = async (now) => {
    const nowAsSecondOfDay = toSecondOfDay(now);
    const halfHourBefore = nowAsSecondOfDay - 20 * HALF_HOUR_IN_SECONDS;
    const halfHourAfter = nowAsSecondOfDay + 20 * HALF_HOUR_IN_SECONDS;

    const users = await prisma.user.findMany();

    // Iterate users and calculate best times
    for (const user of users) {
        delete user.password;
        const sessionData = await prisma.sessionData.findUnique({ where: { userID: user.userID } });

        // Default user's best time to midday if they have no session logged
        if (sessionData.sessionCount === 0) {
            user["bestTime"] = MIDDLE_OF_DAY_IN_SECONDS;
        } else {
            // average midpoint of user's session = start time + (session length / 2)
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
const notifyUsers = async (usersToNotify, socketServer) => {
    for (const user of usersToNotify) {
        // Acquire candidates and pick out top candidate (first in array)
        const res = await fetch(`http://localhost:3000/recommendations/acquireCandidates/for/${user.userID}`).catch((error) => {
            console.log(error);
        });
        const candidates = await res.json();
        const topCandidate = candidates[0];

        const suggestionMessage = `Hey ${user.name || `@${user.username}`}, you might be interested in @${topCandidate.username}`;
        socketServer.to(`user_${user.userID}`).emit(DELIVER_NOTIFICATION, `${suggestionMessage} | ${new Date().toLocaleTimeString()}`);
    }
};
