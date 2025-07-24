import { PrismaClient } from "../../../generated/prisma/index.js";
import computeAverageHighInteractionDensityTime from "./computeAverageHighInteractionDensityTime.js";

const prisma = new PrismaClient();

// Generates a user's app usage vector based on session and interaction metrics, returns vector as array
const createAppUsageVector = async (user) => {
    const userSessionData = await prisma.sessionData.findUnique({ where: { userID: user.userID } });
    const userInteractionData = await prisma.interactionData.findUnique({ where: { userID: user.userID } });

    const userAverageHighInteractionDensityTime = computeAverageHighInteractionDensityTime(userInteractionData);

    const userAppUsageVector = [userSessionData.averageSessionStartTime, userSessionData.averageSessionTime, userAverageHighInteractionDensityTime];

    return userAppUsageVector;
};

export default createAppUsageVector;
