import { removeStopwords } from "stopword";
import { NON_ALPHANUMERIC_REGEX } from "../../constants.js";

// Filter out stop words and non-alphanumeric characters from the content of a post
const filterTokens = (content) => {
    // Convert to lowercase, remove non-alphanumeric characters
    const contentToArray = new String(content).toLowerCase().split(NON_ALPHANUMERIC_REGEX);
    // remove stop words and further filter resulting tokens < 3 characters long
    const filteredContent = removeStopwords(contentToArray).filter((token) => token.length > 2);
    return filteredContent;
};

export default filterTokens;
