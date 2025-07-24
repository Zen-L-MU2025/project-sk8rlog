import toSecondOfDay from "./toSecondOfDay.js";
import { LIKE, COMMENT, CREATE } from "../constants.js";

// Recalculates the metrics of the specified interaction type based on provided user's interaction data
const recalculateInteractionAverages = async (userID, prisma, interactionType) => {
    const userInteractionData = await prisma.interactionData.findUnique({
        where: { userID },
    });

    let {
        likeInteractionCount,
        averageLikeInteractionTime,
        commentInteractionCount,
        averageCommentInteractionTime,
        createInteractionCount,
        averageCreateInteractionTime,
    } = userInteractionData;

    const now = new Date();
    const interactionTimeAsSecondOfDay = toSecondOfDay(now);

    let avgInteractionTime, interactionCount;

    switch (interactionType) {
        case LIKE:
            avgInteractionTime = averageLikeInteractionTime || 0;
            interactionCount = likeInteractionCount;
            break;

        case COMMENT:
            avgInteractionTime = averageCommentInteractionTime || 0;
            interactionCount = commentInteractionCount;
            break;

        case CREATE:
            avgInteractionTime = averageCreateInteractionTime || 0;
            interactionCount = createInteractionCount;
            break;

        default:
            throw new Error(`Invalid interaction type: ${interactionType}`);
    }

    const newAverage = Math.ceil((avgInteractionTime * interactionCount + interactionTimeAsSecondOfDay) / (interactionCount + 1));
    const newInteractionCount = interactionCount + 1;

    const data = setData(interactionType, newAverage, newInteractionCount);

    await prisma.interactionData.update({
        where: { userID },
        data: data,
    });
};

const setData = (interactionType, newAverage, newInteractionCount) => {
    switch (interactionType) {
        case LIKE:
            return { likeInteractionCount: newInteractionCount, averageLikeInteractionTime: newAverage };

        case COMMENT:
            return { commentInteractionCount: newInteractionCount, averageCommentInteractionTime: newAverage };

        case CREATE:
            return { createInteractionCount: newInteractionCount, averageCreateInteractionTime: newAverage };

        default:
            throw new Error(`Invalid interaction type: ${interactionType}`);
    }
};

export default recalculateInteractionAverages;
