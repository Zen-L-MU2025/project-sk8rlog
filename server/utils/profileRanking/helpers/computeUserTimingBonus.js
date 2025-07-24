import { USER_TIMING_BONUS } from "../../constants.js";
import similarity from "compute-cosine-similarity";
import createAppUsageVector from "./createAppUsageVector.js";

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

export default computeUserTimingBonus;
