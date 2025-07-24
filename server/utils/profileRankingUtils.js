import { PrismaClient } from "../generated/prisma/index.js";
import {
    RANKING_MODES,
    POST_OVERALL_WEIGHT,
    POPULARITY_OVERALL_WEIGHT,
    NO_CORRELATION,
    MILLISECONDS_IN_DAY,
    RECENCY_CUTOFF_IN_DAYS,
    RELEVANCY_CUTOFF,
    MEANINFUL_INTERACTION_BONUS,
    LIKE_POINT_VALUE,
    COMMENT_POINT_VALUE,
    INTERACTION_POINTS_THRESHOLD,
    USER_TIMING_BONUS,
} from "./constants.js";
import { scorePosts } from "./serverPostRecommendationUtils.js";
import similarity from "compute-cosine-similarity";

const prisma = new PrismaClient();

// Rank suggestion candidates for some user and return candidates in descending order of score
export const rankCandidates = async (hostUserID) => {
    const user = await prisma.user.findUnique({ where: { userID: hostUserID } });
    // No passwords
    delete user.password;

    let candidates = await prisma.user.findMany({
        where: { userID: { not: hostUserID, notIn: user.followedUsers } },
    });

    for (const candidate of candidates) {
        // No passwords
        delete candidate.password;
        candidate["candidacyScore"] = await evaluateCandidate(user, candidate);
    }

    candidates.sort((a, b) => b.candidacyScore - a.candidacyScore);

    return candidates;
};

// Evaluate a suggestion candidate for a user based on outlined metrics
const evaluateCandidate = async (user, candidate) => {
    if (!user || !candidate) {
        console.log("evaluateCandidate: user or candidate is null");
        return NaN;
    }

    const isSuggestable = await checkSuggestionsEligibility(user, candidate);

    if (!isSuggestable) {
        return -Infinity;
    }

    // 0) Rank candidate's posts using created recommendation algorithm and set base score
    // 1) Gauge if the user interacts with the candidate's in a meaningful capacity
    const { postOverall, popularityOverall, meaningfulInteractionBonus } = await computeCandidatePostMetrics(user, candidate);

    const baseScore = postOverall * POST_OVERALL_WEIGHT + popularityOverall * POPULARITY_OVERALL_WEIGHT;

    // 2A) Compute the similarity score between the users
    const cosineSimilarityScore = await computeSimilarityScore(user, candidate);

    // 2B) Convert the similarity score to a scalar factor
    const similarityFactor = (1 + Math.abs(cosineSimilarityScore)) * (cosineSimilarityScore < 0 ? -1 : 1);

    // 3) Find the mutual following frequency between the users
    const mutualFollowFrequency = computeMutualFollowingFrequency(user, candidate);

    // 4) Apply a bonus contingent to how closely the user and candidate's app usage aligns
    const userTimingBonus = await computeUserTimingBonus(user, candidate);

    // Combine the bonuses
    const bonuses = meaningfulInteractionBonus + userTimingBonus;

    // Finalize and return the candidate's score
    const candidateScore = baseScore * similarityFactor * (1 + mutualFollowFrequency) + bonuses;
    return candidateScore;
};

// Returns boolean indicating if the candidate is eligible for suggestion
const checkSuggestionsEligibility = async (user, candidate) => {
    // Get recently suggested users and last suggestion date for candidate being evaluated
    const recentlySuggestedUsers = user.suggestedUsers;
    const lastSuggestedDate = recentlySuggestedUsers[candidate.userID] || null;

    if (!lastSuggestedDate) return true;

    // If the candidate was recently suggested, check if they're eligible for re-suggestion
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
};

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

// Produces a vector for user and candidate consisting of session and interaction metrics
// Using the vectors' cosine similarity score, returns constant to add to the candidate's score
const computeUserTimingBonus = async (user, candidate) => {
    const userAppUsageVector = await createAppUsageVector(user);
    const candidateAppUsageVector = await createAppUsageVector(candidate);

    const cosineSimilarityScore = similarity(userAppUsageVector, candidateAppUsageVector);

    // Comparison is inapplicable or vectors are inferred to be opposing in nature, don't apply the bonus
    if (!cosineSimilarityScore || cosineSimilarityScore < 0) return 0;

    // Scale the user timing bonus to the vectors' similarity
    return USER_TIMING_BONUS * (1 + cosineSimilarityScore);
};

// Generates a user's app usage vector based on session and interaction metrics, returns vector as array
const createAppUsageVector = async (user) => {
    const userSessionData = await prisma.sessionData.findUnique({ where: { userID: user.userID } });
    const userInteractionData = await prisma.interactionData.findUnique({ where: { userID: user.userID } });

    const userAverageHighInteractionDensityTime = computeAverageHighInteractionDensityTime(userInteractionData);

    const userAppUsageVector = [userSessionData.averageSessionStartTime, userSessionData.averageSessionTime, userAverageHighInteractionDensityTime];

    return userAppUsageVector;
};

// Returns average high interaction density time for provided user interaction data
const computeAverageHighInteractionDensityTime = (interactionData) => {
    const hasLiked = interactionData.likeInteractionCount > 0 ? 1 : 0;
    const hasCommented = interactionData.commentInteractionCount > 0 ? 1 : 0;
    const hasCreated = interactionData.createInteractionCount > 0 ? 1 : 0;

    const userTotalInteractionFields = hasLiked + hasCommented + hasCreated;

    // No point in proceeding
    if (userTotalInteractionFields === 0) return 0;

    const inUseAverageLikeInteractionTime = hasLiked * interactionData.averageLikeInteractionTime;
    const inUseAverageCommentInteractionTime = hasCommented * interactionData.averageCommentInteractionTime;
    const inUseAverageCreateInteractionTime = hasCreated * interactionData.averageCreateInteractionTime;

    const userTimesAggregate = inUseAverageLikeInteractionTime + inUseAverageCommentInteractionTime + inUseAverageCreateInteractionTime;

    return Math.ceil(userTimesAggregate / userTotalInteractionFields);
};
