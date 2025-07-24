import { NON_ALPHANUMERIC_REGEX, CLIPS } from "../../constants.js";
import calculateClipVideoLengthAsWordCount from "./calculateClipVideoLengthAsWordCount.js";

// Calculate a post's overall length depending on description and video length (if it is a clip)
const getPostLength = async (post) => {
    let postLength = new String(post.description).split(NON_ALPHANUMERIC_REGEX).length;

    if (post.type === CLIPS) {
        postLength += await calculateClipVideoLengthAsWordCount(post.fileURL);
    }

    return postLength;
};

export default getPostLength;
