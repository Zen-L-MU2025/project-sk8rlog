// Returns average high interaction density time for provided user interaction data
const computeAverageHighInteractionDensityTime = (interactionData) => {
    const hasLiked = interactionData.likeInteractionCount > 0 ? 1 : 0;
    const hasCommented = interactionData.commentInteractionCount > 0 ? 1 : 0;
    const hasCreated = interactionData.createInteractionCount > 0 ? 1 : 0;

    const userTotalInteractionFields = hasLiked + hasCommented + hasCreated;

    // No point in proceeding
    if (userTotalInteractionFields === 0) return 0;

    const inUseAverageLikeInteractionTime = hasLiked * interactionData.averageLikeInteractionTime;
    const inUseAverageCommentInteractionTime = hasCommented * interactionData.averageCommentInteractionTime;
    const inUseAverageCreateInteractionTime = hasCreated * interactionData.averageCreateInteractionTime;

    const userTimesAggregate = inUseAverageLikeInteractionTime + inUseAverageCommentInteractionTime + inUseAverageCreateInteractionTime;

    return Math.ceil(userTimesAggregate / userTotalInteractionFields);
};

export default computeAverageHighInteractionDensityTime;
