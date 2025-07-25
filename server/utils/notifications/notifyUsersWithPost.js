import { POST_SCORE_THRESHOLD, POST_SUGGESTION } from "../constants.js";
import { calculateSinglePostScoreWithUserObject } from "../postRecommendations/calculateSinglePostScore.js";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const notifyUsersWithPost = async (post, socketServer) => {
    const users = await prisma.user.findMany({ where: { userID: { not: post.authorID } } });

    for (const user of users) {
        // Deep copy the provided post for synchronous processing
        const postCopy = JSON.parse(JSON.stringify(post));
        await calculateSinglePostScoreWithUserObject(postCopy, user);

        if (postCopy.score < POST_SCORE_THRESHOLD) continue;

        socketServer.to(`user_${user.userID}`).emit(DELIVER_NOTIFICATION, {
            recipient: [user.name || `@${user.username}`],
            type: POST_SUGGESTION,
            data: postCopy,
            timestamp: new Date().toLocaleTimeString(),
        });
    }
};

export default notifyUsersWithPost;
