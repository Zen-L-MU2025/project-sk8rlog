import toSecondOfDay from "./toSecondOfDay.js";
import { MS_IN_SECOND } from "../constants.js";

// Recalculates the average session time, start time, and end time based on provided user's session data
const recalculateSessionAverages = async (userID, prisma) => {
    const userSessionData = await prisma.sessionData.findUnique({
        where: { userID },
    });

    let { sessionCount, averageSessionTime, lastSessionStartTime, averageSessionStartTime, averageSessionEndTime } = userSessionData;

    const logoutTime = new Date();

    const sessionDurationInSeconds = (logoutTime.getTime() - lastSessionStartTime.getTime()) / MS_IN_SECOND;

    // Recalculate the user's average session start time as the nth second of the day
    const avgStartAsSecondOfDay = averageSessionStartTime || 0;
    const lastSessionStartAsSecondOfDay = toSecondOfDay(lastSessionStartTime);
    const newAverageSessionStartTimeAsSecondOfDay = (avgStartAsSecondOfDay * sessionCount + lastSessionStartAsSecondOfDay) / (sessionCount + 1);

    // Recalculate the user's average session end time as the nth second of the day
    const avgEndAsSecondOfDay = averageSessionEndTime || 0;
    const lastSessionEndAsSecondOfDay = toSecondOfDay(logoutTime);
    const newAverageSessionEndTimeAsSecondOfDay = (avgEndAsSecondOfDay * sessionCount + lastSessionEndAsSecondOfDay) / (sessionCount + 1);

    // Round new averages to finalize
    const newSessionCount = sessionCount + 1;
    const newAverageSessionTime = Math.ceil((averageSessionTime * sessionCount + sessionDurationInSeconds) / (sessionCount + 1));
    const newAverageSessionStartTime = Math.floor(newAverageSessionStartTimeAsSecondOfDay);
    const newAverageSessionEndTime = Math.ceil(newAverageSessionEndTimeAsSecondOfDay);

    await prisma.sessionData.update({
        where: { userID },
        data: {
            sessionCount: newSessionCount,
            averageSessionTime: newAverageSessionTime,
            averageSessionStartTime: newAverageSessionStartTime,
            averageSessionEndTime: newAverageSessionEndTime,
        },
    });
};

export default recalculateSessionAverages;
