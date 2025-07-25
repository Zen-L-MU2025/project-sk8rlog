import { LIKE_WEIGHT, COMMENT_WEIGHT, CLIPS, NOT_APPLICABLE } from "../constants.js";
import calculateBiasFactors from "./helpers/calculateBiasFactors.js";
import filterTokens from "./helpers/filterTokens.js";
import calculateTokenScore from "./helpers/calculateTokenScore.js";
import getPostLength from "./helpers/getPostLength.js";
import calculateProximityBias from "../calculateProximityBias.js";

// Wrapper function for calculateSinglePostScore > takes in a user obj as argument to generate full set of params
// Used in the post notifications flow
export const calculateSinglePostScoreWithUserObject = async (post, user) => {
    const userFrequency = user.user_Frequency;
    const { portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts } = await calculateBiasFactors(user);
    const portionOfLikedPostsThatAreBlogs = 1 - portionOfLikedPostsThatAreClips;
    const userLocation = user.location;

    await calculateSinglePostScore(
        post,
        userFrequency,
        avgLengthOfLikedPosts,
        portionOfLikedPostsThatAreClips,
        portionOfLikedPostsThatAreBlogs,
        userLocation
    );
};

// Calculates a post's score and assigns it to the provided post object
const calculateSinglePostScore = async (
    post,
    userFrequency,
    avgLengthOfLikedPosts,
    portionOfLikedPostsThatAreClips,
    portionOfLikedPostsThatAreBlogs,
    userLocation
) => {
    let rawPostScore = 0;

    // Default popularity score to 1
    const popularityScore = 1 + post.likeCount * LIKE_WEIGHT + post.comments?.length * COMMENT_WEIGHT;

    const filteredPostContent = filterTokens(post.description);
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

    // Calculate post length bias based on percentage disparity from average length of liked posts
    let postLengthBias = 1;
    if (avgLengthOfLikedPosts !== NOT_APPLICABLE) {
        const percentageLengthDisparity = Math.abs(1 - postLength / avgLengthOfLikedPosts) * 100;
        postLengthBias = 1 / Math.sqrt(percentageLengthDisparity);
    }

    // Select appropriate post type bias
    let typeBias = 0;
    if (portionOfLikedPostsThatAreClips !== NOT_APPLICABLE) {
        typeBias = post.type === CLIPS ? portionOfLikedPostsThatAreClips : portionOfLikedPostsThatAreBlogs;
    }

    // Calculate the relative interest factor of the post based on overlap size
    const overlapSize = Object.keys(overlap).length;
    const relativeInterestFactor = overlapSize ? overlapSize / filteredPostContent.length : 1;

    // Calculate bias factor as popularity amplified by type bias and inhibited by disparity from average post length
    const biasFactor = popularityScore * (1 + typeBias) * postLengthBias;

    // Calculate proximity bias as constant factor added to overall score
    const proximityBias = calculateProximityBias(userLocation, post.location);

    // Apply relative interest factor and bias factor to raw post score to get the final score
    const finalScore = rawPostScore * relativeInterestFactor * biasFactor + proximityBias;
    post["score"] = finalScore;
    post["popularity"] = popularityScore;
};

export default calculateSinglePostScore;
