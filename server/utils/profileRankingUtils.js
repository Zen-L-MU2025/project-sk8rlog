const RECOMMENDED = "recommended";

export const rankCandidates = async (user) => {
    let candidates = [1, 2, 3, 4, 5]; // placeholder: prisma statement

    for (const candidate in candidates) {
        candidate["score"] = await evaluateCandidate(user, candidate, scorePosts);
    }

    candidates.sort((a, b) => b.score - a.score);

    return candidates;
};

export const evaluateCandidate = async (user, candidate, scorePosts) => {
    if (!user || !candidate) {
        console.log("evaluateCandidate: user or candidate is null");
        return NaN;
    }

    // update prisma db + statement
    if (user.suggestedCandidates.includes(candidate.userID)) {
        return -Infinity;
    }

    const candidatePosts = candidate.posts; // prisma statement
    const setCandidatePosts = (updatedPosts) => {
        candidatePosts = updatedPosts;
    };

    scorePosts(candidatePosts, user, setCandidatePosts, RECOMMENDED);
    let totalScore = 0;
    for (const post of candidatePosts) {
        totalScore += post.score;
    }
    const postOvr = totalScore / candidatePosts.length;

    const userFreq = user.userFrequency;
    const candidateFreq = candidate.userFrequency;

    // vectorize
    // pass insto cosine similarity function
    const similarityScore = 1738; // placeholder
    const similarityFactor = similarityScore < 0 ? -1 + similarityScore : 1 + similarityScore;

    const userFollowing = user.followedUsers;
    const candidateFollowing = candidate.followedUsers;
    const followingOverlap = userFollowing.filter((user) => candidateFollowing.includes(user));

    const followingUnion = new Set(userFollowing.concat(candidateFollowing));
    const mutualFollowFrequency = followingOverlap.length / followingUnion.size;

    const candidateScore = postOvr * similarityFactor * (1 + mutualFollowFrequency);

    return candidateScore;
};
