import { RANKING_MODES } from "../../constants.js";

// Sort posts by either recommendation score or popularity
const sortByMetric = (posts, scoringMode) => {
    return posts.toSorted((a, b) => {
        const scoreDiff = b.score - a.score;
        const popularityDiff = b.popularity - a.popularity;
        const dateDiff = new Date(b.creationDate) - new Date(a.creationDate);

        switch (scoringMode) {
            case RANKING_MODES.DEFAULT:
            case RANKING_MODES.RECOMMENDED:
                if (scoreDiff !== 0) return scoreDiff;
                if (popularityDiff !== 0) return popularityDiff;
                return dateDiff;

            case RANKING_MODES.POPULAR:
                if (popularityDiff !== 0) return popularityDiff;
                if (scoreDiff !== 0) return scoreDiff;
                return dateDiff;

            case RANKING_MODES.NEAR_YOU:
            case RANKING_MODES.LATEST:
                return dateDiff;

            default:
                console.error("Invalid scoringMode provided to sortByMetric");
                return 0;
        }
    });
};

export default sortByMetric;
