import { PrismaClient } from "../../../generated/prisma/index.js";
import { MILLISECONDS_IN_DAY, SUGGESTION_RECENCY_CUTOFF_IN_DAYS } from "../../constants.js";

const prisma = new PrismaClient();

// Returns boolean indicating if the candidate is eligible for suggestion
const checkSuggestionsEligibility = async (user, candidate) => {
    // Get recently suggested users and last suggestion date for candidate being evaluated
    const recentlySuggestedUsers = user.suggestedUsers;
    const lastSuggestedDate = recentlySuggestedUsers[candidate.userID] || null;

    if (!lastSuggestedDate) return true;

    // If the candidate was recently suggested, check if they're eligible for re-suggestion
    const daysSinceLastSuggested = (Date.now() - new Date(lastSuggestedDate)) / MILLISECONDS_IN_DAY;

    // Too soon
    if (daysSinceLastSuggested < SUGGESTION_RECENCY_CUTOFF_IN_DAYS) {
        return false;
    }

    // It's been long enough, remove the candidate from the recently suggested list
    else {
        delete recentlySuggestedUsers[candidate.userID];
        await prisma.user.update({ where: { userID: user.userID }, data: { suggestedUsers: recentlySuggestedUsers } });
        return true;
    }
};

export default checkSuggestionsEligibility;
