import { POST_OVERALL_WEIGHT, POPULARITY_OVERALL_WEIGHT } from "../constants.js";
import checkSuggestionsEligibility from "./helpers/checkSuggestionsEligibility.js";
import computeCandidatePostMetrics from "./helpers/computeCandidatePostMetrics.js";
import computeSimilarityScore from "./helpers/computeSimilarityScore.js";
import computeMutualFollowingFrequency from "./helpers/computeMutualFollowingFrequency.js";
import computeUserTimingBonus from "./helpers/computeUserTimingBonus.js";
import calculateProximityBias from "../calculateProximityBias.js";

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

    // 5) Apply a bonus corresponding to the user's proximity to the candidate
    const proximityBonus = calculateProximityBias(user.location, candidate.location);

    // Combine the bonuses
    const bonuses = meaningfulInteractionBonus + userTimingBonus + proximityBonus;

    // Finalize and return the candidate's score
    const candidateScore = baseScore * similarityFactor * (1 + mutualFollowFrequency) + bonuses;
    return candidateScore;
};

export default evaluateCandidate;
