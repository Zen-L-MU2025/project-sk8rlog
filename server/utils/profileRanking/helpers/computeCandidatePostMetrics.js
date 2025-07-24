import { PrismaClient } from "../../../generated/prisma/index.js";
import { RANKING_MODES } from "../../constants.js";
import { scorePosts } from "../../serverPostRecommendationUtils.js";
import computeMeaningfulInteractionBonus from "./computeMeaningfulInteractionBonus.js";

const prisma = new PrismaClient();

// Computes overall posts score and popularity score for a candidate
const computeCandidatePostMetrics = async (user, candidate) => {
    const candidatePosts = await prisma.post.findMany({ where: { authorID: candidate.userID } });
    let postOverall = 0;
    let popularityOverall = 0;
    let meaningfulInteractionBonus = 0;

    // Return early if candidate has no posts
    if (candidatePosts.length === 0) return { postOverall, popularityOverall, meaningfulInteractionBonus };

    meaningfulInteractionBonus = await computeMeaningfulInteractionBonus(user, candidatePosts);

    // Average post scores as an overall posts score
    let rankedCandidatePosts = await scorePosts(candidatePosts, user, RANKING_MODES.RECOMMENDED);
    let totalScore = 0;
    let totalPopularity = 0;
    for (const post of rankedCandidatePosts) {
        totalScore += post.score;
        totalPopularity += post.popularity;
    }
    postOverall = totalScore / candidatePosts.length;
    popularityOverall = totalPopularity / candidatePosts.length;

    return { postOverall, popularityOverall, meaningfulInteractionBonus };
};

export default computeCandidatePostMetrics;
