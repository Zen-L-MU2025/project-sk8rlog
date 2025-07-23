import { PrismaClient } from "../generated/prisma/index.js";
import { RANKING_MODES, POST_OVR_WEIGHT, POPULARITY_OVR_WEIGHT, NO_CORRELATION, MILLISECONDS_IN_DAY, RECENCY_CUTOFF_IN_DAYS } from "./constants.js";
import { scorePosts } from "./serverPostRecommendationUtils.js";

const prisma = new PrismaClient();

// Rank suggestion candidates for some user and return candidates in descending order of score
export const rankCandidates = async (hostUserID) => {
    const user = await prisma.user.findUnique({ where: { userID: hostUserID } });
    // No passwords
    delete user.password;

    let candidates = await prisma.user.findMany({
        // for when we have a following list
        //where: { userID: { notIn: user.followedUsers } },
        where: { userID: { not: hostUserID } },
    });

    for (const candidate of candidates) {
        // No passwords
        delete candidate.password;
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

    const isSuggestable = await checkSuggestionsEligibility(user, candidate);

    if (!isSuggestable) {
        return -Infinity;
    }

    // Rank posts using created recommendation algorithm
    const { postOvr, popularityOvr } = await computeCandidatePostMetrics(user, candidate);

    const baseScore = postOvr * POST_OVR_WEIGHT + popularityOvr * POPULARITY_OVR_WEIGHT;

    // Compute the similarity score between the users
    const cosineSimilarityScore = await computeSimilarityScore(user, candidate);

    // Convert the similarity score to a scalar factor
    const similarityFactor = (1 + Math.abs(cosineSimilarityScore)) * (cosineSimilarityScore < 0 ? -1 : 1);

    // Find the mutual following frequency between the users
    const mutualFollowFrequency = computeMutualFollowingFrequency(user, candidate);

    // Finalize and return the candidate's score
    const candidateScore = baseScore * similarityFactor * (1 + mutualFollowFrequency);
    return candidateScore;
};

// Returns boolean indicating if the candidate is eligible for suggestion
const checkSuggestionsEligibility = async (user, candidate) => {
    // Get recently suggested users and last suggestion date for candidate being evaluated
    const recentlySuggestedUsers = user.suggestedUsers;
    const lastSuggestedDate = recentlySuggestedUsers[candidate.userID] || null;

    // If the candidate was recently suggested check, if they're eligible for re-suggestion
    if (lastSuggestedDate) {
        const daysSinceLastSuggested = (Date.now() - new Date(lastSuggestedDate)) / MILLISECONDS_IN_DAY;

        // Too soon
        if (daysSinceLastSuggested < RECENCY_CUTOFF_IN_DAYS) {
            return false;
        }

        // It's been long enough, remove the candidate from the recently suggested list
        else {
            delete recentlySuggestedUsers[candidate.userID];
            await prisma.user.update({ where: { userID: user.userID }, data: { suggestedUsers: recentlySuggestedUsers } });
            return true;
        }
    }
};

// Computes overall posts score and popularity score for a candidate
const computeCandidatePostMetrics = async (user, candidate) => {
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

    return { postOvr, popularityOvr };
};

// Vectorize the users' frequency objects and performs a cosine similarity comparison to get a similarity score
const computeSimilarityScore = async (user, candidate) => {
    // Vectorize the users' frequency objects and perform a cosine similarity comparison
    const userFrequency = user.user_Frequency || {};
    const candidateFrequency = candidate.user_Frequency || {};

    const userKeywords = Object.keys(userFrequency);
    const candidateKeywords = Object.keys(candidateFrequency);

    let userEmbedding, candidateEmbedding, cosineSimilarityScore;

    // Send data to Python server to generate embeddings and compute cosine similarity
    await fetch("http://localhost:1738/embedUserFrequency", {
        body: JSON.stringify({ userFrequency, candidateFrequency, userKeywords, candidateKeywords }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            userEmbedding = data.userEmbedding;
            candidateEmbedding = data.candidateEmbedding;
            cosineSimilarityScore = isNaN(data.cosineSimilarityScore) ? NO_CORRELATION : data.cosineSimilarityScore;
        })
        .catch((err) => {
            console.log(err);
            cosineSimilarityScore = 0;
        });

    return cosineSimilarityScore;
};

// Calculates the mutual following frequency between the user and candidate
const computeMutualFollowingFrequency = (user, candidate) => {
    // Find users' following overlap
    const userFollowing = user.followedUsers;
    const candidateFollowing = candidate.followedUsers;
    const followingOverlap = userFollowing.filter((user) => candidateFollowing.includes(user));

    // Hold this overlap against all users they follow to create a mutual following factor
    const followingUnion = new Set(userFollowing.concat(candidateFollowing));
    const mutualFollowFrequency = followingUnion.size === 0 ? 0 : followingOverlap.length / followingUnion.size;

    return mutualFollowFrequency;
};
