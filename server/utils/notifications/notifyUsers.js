import { DELIVER_NOTIFICATION, USER_SUGGESTION } from "../constants.js";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

// Grab top candidate for each user lined up and emit the notification through the WebSocket
const notifyUsers = async (usersToNotify, socketServer) => {
    usersToNotify.forEach(async (user) => {
        // Acquire candidates and pick out top candidate (first in array)
        const res = await fetch(`http://localhost:3000/recommendations/acquireCandidates/for/${user.userID}`).catch((error) => {
            console.log(error);
        });
        const candidates = await res.json();

        const topCandidate = candidates[0];

        // If there are no valid candidates, do nothing
        if (topCandidate.candidacyScore == null) {
            return;
        }

        // Update the user's suggestedUsers column with the selected candidate
        const userObject = await prisma.user.findUnique({ where: { userID: user.userID } });
        const updatedSuggestedUsers = { ...userObject.suggestedUsers, [topCandidate.userID]: new Date() };
        await prisma.user.update({
            where: { userID: user.userID },
            data: {
                suggestedUsers: updatedSuggestedUsers,
            },
        });

        socketServer.to(`user_${user.userID}`).emit(DELIVER_NOTIFICATION, {
            recipient: [user.name || `@${user.username}`],
            type: USER_SUGGESTION,
            data: topCandidate,
            timestamp: new Date().toLocaleTimeString(),
        });
    });
};

export default notifyUsers;
