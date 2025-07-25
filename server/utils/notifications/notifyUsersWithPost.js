import { POST_SCORE_THRESHOLD } from "../constants.js";
import { calculateSinglePostScoreWithUserObject } from "../postRecommendations/calculateSinglePostScore.js";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const notifyUsersWithPost = async (post, socketServer) => {
    console.log("Let's ride");
    const users = await prisma.user.findMany({ where: { userID: { not: post.authorID } } });

    for (const user of users) {
        // Deep copy the provided post for synchronous processing
        const postCopy = JSON.parse(JSON.stringify(post));
        await calculateSinglePostScoreWithUserObject(postCopy, user);
        console.log(`${user.username} X new post score: ${postCopy.score}, met threshold: ${postCopy.score >= POST_SCORE_THRESHOLD}`);
    }
};

export default notifyUsersWithPost;
