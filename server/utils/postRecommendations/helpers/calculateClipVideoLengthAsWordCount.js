import { getVideoDurationInSeconds } from "get-video-duration";
import { AVERAGE_WORDS_READ_PER_SECOND } from "../../constants.js";

// Calculate a clip's video length translated to a "word count" using the average reading speed
const calculateClipVideoLengthAsWordCount = async (fileURL) => {
    const clipLength = await getVideoDurationInSeconds(fileURL).catch((error) => {
        console.error(error);
    });
    const clipLengthAsWordCount = Math.ceil(clipLength * AVERAGE_WORDS_READ_PER_SECOND);
    return clipLengthAsWordCount;
};

export default calculateClipVideoLengthAsWordCount;
