import { PrismaClient } from "../../../generated/prisma/index.js";
import {
    RELEVANCY_CUTOFF,
    MEANINFUL_INTERACTION_BONUS,
    LIKE_POINT_VALUE,
    COMMENT_POINT_VALUE,
    INTERACTION_POINTS_THRESHOLD,
} from "../../constants.js";
const prisma = new PrismaClient();

// Gagues if the user has interacted with a candidate's recent posts in a meaningful capacity
// Returns a constant to add to the candidate's score
const computeMeaningfulInteractionBonus = async (user, candidatePosts) => {
    // TLDR: Sort candidate's posts by date and pick the RELEVANCY_CUTOFF most recent
    const postsToAssess = candidatePosts.toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).slice(0, RELEVANCY_CUTOFF);

    // Init post interactions tally
    let userLikesTally = 0;
    let userCommentsTally = 0;

    for (const post of postsToAssess) {
        if (user.likedPosts.includes(post.postID)) userLikesTally++;

        const userCommentsOnPost = await prisma.comment.findMany({ where: { commentID: { in: post.comments }, authorID: user.userID } });
        userCommentsTally += userCommentsOnPost.length;
    }

    const totalInteractionPoints = userLikesTally * LIKE_POINT_VALUE + userCommentsTally + COMMENT_POINT_VALUE;
    return totalInteractionPoints >= INTERACTION_POINTS_THRESHOLD ? MEANINFUL_INTERACTION_BONUS : 0;
};

export default computeMeaningfulInteractionBonus;
