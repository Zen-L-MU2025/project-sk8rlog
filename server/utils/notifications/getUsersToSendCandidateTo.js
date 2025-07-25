import toSecondOfDay from "../sessions/toSecondOfDay.js";
import { HALF_HOUR_IN_SECONDS, MIDDLE_OF_DAY_IN_SECONDS } from "../constants.js";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

// Calculates users' best notification times and queues them to be notified if it falls within the cron job window
const getUsersToSendCandidateTo = async (now) => {
    const nowAsSecondOfDay = toSecondOfDay(now);
    const halfHourBefore = nowAsSecondOfDay - HALF_HOUR_IN_SECONDS;
    const halfHourAfter = nowAsSecondOfDay + HALF_HOUR_IN_SECONDS;

    const users = await prisma.user.findMany();
    // TESTING: return users here to trigger mass notify

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

export default getUsersToSendCandidateTo;
