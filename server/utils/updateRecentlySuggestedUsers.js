// Remove user to follow from suggested users if they're present in it
const updateRecentlySuggestedUsers = (user, userBeingReferencedID) => {
    // Remove user to follow from suggested users if they're present in it
    const recentlySuggestedUsers = user.suggestedUsers;

    if (recentlySuggestedUsers[userBeingReferencedID]) {
        delete recentlySuggestedUsers[userBeingReferencedID];
    }

    return recentlySuggestedUsers;
};

export default updateRecentlySuggestedUsers;
