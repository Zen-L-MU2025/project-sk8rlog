// Calculates the mutual following frequency between the user and candidate
const computeMutualFollowingFrequency = (user, candidate) => {
    // Find users' following overlap
    const userFollowing = user.followedUsers;
    const candidateFollowing = candidate.followedUsers;
    const followingOverlap = userFollowing.filter((user) => candidateFollowing.includes(user));

    // Hold this overlap against all users they follow to create a mutual following factor
    const followingUnion = new Set(userFollowing.concat(candidateFollowing));
    const mutualFollowFrequency = followingUnion.size === 0 ? 0 : followingOverlap.length / followingUnion.size;

    return mutualFollowFrequency;
};

export default computeMutualFollowingFrequency;
