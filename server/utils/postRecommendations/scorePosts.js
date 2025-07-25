import { RANKING_MODES } from "../constants.js";
import filterPostsByCutoff from "./helpers/filterPostsByCutoff.js";
import calculateBiasFactors from "./helpers/calculateBiasFactors.js";
import calculateSinglePostScore from "./calculateSinglePostScore.js";
import sortByMetric from "./helpers/sortByMetric.js";

// Score every post based on the user's frequency map and set client posts state to results
const scorePosts = async (posts, activeUser, scoringMode) => {
    const userFrequency = activeUser.user_Frequency;

    // If the user has no liked posts, manually override the scoring mode to popularity
    if (!activeUser.likedPosts) {
        scoringMode = RANKING_MODES.POPULAR;
    }

    // [Testing] Omit as comment when testing
    posts = await filterPostsByCutoff(posts);

    // Find the user's post type and length biases
    const { portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts } = await calculateBiasFactors(activeUser);
    const portionOfLikedPostsThatAreBlogs = 1 - portionOfLikedPostsThatAreClips;

    // Grab user's location for proximity biasing
    const userLocation = activeUser.location;

    for (const post of posts) {
        await calculateSinglePostScore(
            post,
            userFrequency,
            avgLengthOfLikedPosts,
            portionOfLikedPostsThatAreClips,
            portionOfLikedPostsThatAreBlogs,
            userLocation
        );
    }

    // Sort posts by either recommendation score or popularity
    // Let tie breakers be handled by other option and finally by creation date
    posts = sortByMetric(posts, scoringMode);
    return posts;
};

export default scorePosts;
