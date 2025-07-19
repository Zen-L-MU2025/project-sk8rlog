import { PrismaClient } from "../generated/prisma/index.js";
import { RANKING_MODES } from "./constants.js";
import { scorePosts } from "./serverPostRecommendationUtils.js";

const prisma = new PrismaClient();

// Rank suggestion candidates for some user and return candidates in descending order of score
export const rankCandidates = async (hostUserID) => {
    const user = await prisma.user.findUnique({ where: { userID: hostUserID } });

    let candidates = await prisma.user.findMany({
        // for when we have a following list
        //where: { userID: { notIn: user.followedUsers } },
        where: { userID: { not: hostUserID } },
    });

    for (const candidate of candidates) {
        candidate["candidacyScore"] = await evaluateCandidate(user, candidate);
    }

    candidates.sort((a, b) => b.candidacyScore - a.candidacyScore);

    return candidates;
};

// Evaluate a suggestion candidate for a user based on their posts score, interests similarity, and mutual following
const evaluateCandidate = async (user, candidate) => {
    if (!user || !candidate) {
        console.log("evaluateCandidate: user or candidate is null");
        return NaN;
    }

    // for when we have suggested markers
    // if (user.suggestedCandidates.includes(candidate.userID)) {
    //     return -Infinity;
    // }

    // Rank posts using created recommendation algorithm
    const candidatePosts = await prisma.post.findMany({ where: { authorID: candidate.userID } });
    let postOvr = 0;
    let popularityOvr = 0;
    if (candidatePosts.length > 0) {
        // Average post scores an overall posts score
        let rankedCandidatePosts = await scorePosts(candidatePosts, user, RANKING_MODES.RECOMMENDED);
        let totalScore = 0;
        let totalPopularity = 0;
        for (const post of rankedCandidatePosts) {
            totalScore += post.score;
            totalPopularity += post.popularity;
        }
        postOvr = totalScore / candidatePosts.length;
        popularityOvr = totalPopularity / candidatePosts.length;
    }

    return postOvr + popularityOvr; // for now

    // Vectorize the users' frequency objects and perform a cosine similarity comparison
    const userFreq = user.userFrequency;
    const candidateFreq = candidate.userFrequency;
    // then vectorize
    // then pass insto cosine similarity function
    const similarityScore = 0.1738; // placeholder

    // Convert the similarity score to a scalar factor
    const similarityFactor = similarityScore < 0 ? -1 + similarityScore : 1 + similarityScore;

    // Find users' following overlap
    const userFollowing = user.followedUsers;
    const candidateFollowing = candidate.followedUsers;
    const followingOverlap = userFollowing.filter((user) => candidateFollowing.includes(user));

    // Hold this overlap against all users they follow to create a mutual following factor
    const followingUnion = new Set(userFollowing.concat(candidateFollowing));
    const mutualFollowFrequency = followingOverlap.length / followingUnion.size;

    // Finalize and return the candidate's score
    const candidateScore = postOvr * similarityFactor * (1 + mutualFollowFrequency);
    return candidateScore;
};
