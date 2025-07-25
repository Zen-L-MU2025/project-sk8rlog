import { removeStopwords, eng } from "stopword";
import { LIKE, NON_ALPHANUMERIC_REGEX } from "./constants.js";

// Tokenize the content of a post, remove stop words
// If the user has liked the post, increment the frequency of the tokens in the post; decrement if user is unliking
// Store updated frequency in user.user_Frequency
const tokenize = async (post, activeUser, action) => {
    const userFrequency = activeUser.user_Frequency || {};
    const frequencyFactor = action === LIKE ? 1 : -1;

    const content = post.description;
    const filteredContent = await filterTokens(content);

    const tokensUsedInThisInstance = new Set();

    filteredContent.forEach((token) => {
        // If the token is not in the user's frequency map, initialize it
        if (!userFrequency[token]) {
            userFrequency[token] = {};
        }

        // Modify the absolute frequency of the token
        // +1 if the user liked the post, -1 if the user unliked the post
        userFrequency[token]["totalFrequencyAcrossLikedPosts"] = (userFrequency[token].totalFrequencyAcrossLikedPosts || 0) + frequencyFactor;

        // For every unique token in the post, increment/decrement the total number of posts the token is present in by 1/-1
        if (!tokensUsedInThisInstance.has(token)) {
            userFrequency[token].likedPostsPresentIn = (userFrequency[token].likedPostsPresentIn || 0) + frequencyFactor;
            tokensUsedInThisInstance.add(token);
        }
    });

    return userFrequency;
};

// Filter out stop words and non-alphanumeric characters from the content of a post
const filterTokens = async (content) => {
    // Convert to lowercase, remove non-alphanumeric characters
    const contentToArray = new String(content).toLowerCase().split(NON_ALPHANUMERIC_REGEX);
    // remove stop words and further filter resulting tokens < 3 characters long
    const filteredContent = removeStopwords(contentToArray).filter((token) => token.length > 2);
    return filteredContent;
};

export default tokenize;
