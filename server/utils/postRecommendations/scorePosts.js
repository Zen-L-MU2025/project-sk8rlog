import { LIKE_WEIGHT, COMMENT_WEIGHT, CLIPS, NOT_APPLICABLE, RANKING_MODES } from "../constants.js";
import filterPostsByCutoff from "./helpers/filterPostsByCutoff.js";
import calculateBiasFactors from "./helpers/calculateBiasFactors.js";
import filterTokens from "./helpers/filterTokens.js";
import calculateTokenScore from "./helpers/calculateTokenScore.js";
import getPostLength from "./helpers/getPostLength.js";
import sortByMetric from "./helpers/sortByMetric.js";

// Score every post based on the user's frequency map and set client posts state to results
export const scorePosts = async (posts, activeUser, scoringMode) => {
    const userFrequency = activeUser.user_Frequency;

    // If the user has no liked posts, manually override the scoring mode to popularity
    if (!activeUser.likedPosts) {
        scoringMode = RANKING_MODES.POPULAR;
    }

    // TODO: Uncomment age cutoff when fully prod-ready
    //posts = await filterPostsByCutoff(posts)

    // Find the user's post type and length biases
    const { portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts } = await calculateBiasFactors(activeUser);
    const portionOfLikedPostsThatAreBlogs = 1 - portionOfLikedPostsThatAreClips;

    for (const post of posts) {
        let rawPostScore = 0;

        const popularityScore = post.likeCount * LIKE_WEIGHT + post.comments?.length * COMMENT_WEIGHT;

        const filteredPostContent = await filterTokens(post.description);
        let overlap = {};

        // For each unique token in the post, check if it is in the user's frequency map and add to overlap
        // Increment the frequency of this token
        filteredPostContent.forEach((token) => {
            if (userFrequency && userFrequency[token]) {
                overlap[token] = {
                    frequency: (overlap[token] ? overlap[token].frequency : 0) + 1,
                    score: 0,
                };
            }
        });
        // For each token in the overlap, calculate its score and add it to the raw post score
        for (const [tokenName, token] of Object.entries(overlap)) {
            const tokenScore = await calculateTokenScore(post, token, tokenName, userFrequency);
            rawPostScore += tokenScore;
        }

        // Get and save post length
        let postLength = await getPostLength(post);
        post["postLength"] = postLength;

        // Calculate post length bias as percentage difference from average length of liked posts
        let postLengthBias = 1;
        if (avgLengthOfLikedPosts !== NOT_APPLICABLE) {
            postLengthBias = Math.abs(1 - postLength / avgLengthOfLikedPosts);
        }

        // Select appropriate post type bias
        let typeBias = 1;
        if (portionOfLikedPostsThatAreClips !== NOT_APPLICABLE) {
            typeBias = post.type === CLIPS ? portionOfLikedPostsThatAreClips : portionOfLikedPostsThatAreBlogs;
        }

        // Calculate the relative interest factor of the post based on overlap size
        const overlapSize = Object.keys(overlap).length;
        const relativeInterestFactor = overlapSize ? overlapSize / filteredPostContent.length : 1;

        // Calculate bias factor as popularity amplified by type bias and inhibited by disparity from average post length
        const biasFactor = popularityScore * (1 + typeBias) * postLengthBias;

        // Apply relative interest factor and bias factor to raw post score to get the final score
        const finalScore = rawPostScore * relativeInterestFactor * biasFactor;
        post["score"] = finalScore;
        post["popularity"] = popularityScore;
    }

    // Sort posts by either recommendation score or popularity
    // Let tie breakers be handled by other option and finally by creation date
    posts = sortByMetric(posts, scoringMode);
    return posts;
};

export default scorePosts;
