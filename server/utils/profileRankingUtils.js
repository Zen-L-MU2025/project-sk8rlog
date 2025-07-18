const { PrismaClient } = require("../generated/prisma");
const RECOMMENDED = "recommended";

const prisma = new PrismaClient();

// Rank suggestion candidates for some user and return candidates in descending order of score
export const rankCandidates = async (user) => {
    let candidates = await prisma.user.findMany({
        where: { userID: { in: user.followedUsers } },
    });

    for (const candidate in candidates) {
        candidate["score"] = await evaluateCandidate(user, candidate, scorePosts);
    }

    candidates.sort((a, b) => b.score - a.score);

    return candidates;
};

// Evaluate a suggestion candidate for a user based on their posts score, interests similarity, and mutual following
export const evaluateCandidate = async (user, candidate, scorePosts) => {
    if (!user || !candidate) {
        console.log("evaluateCandidate: user or candidate is null");
        return NaN;
    }

    // update prisma db + statement
    if (user.suggestedCandidates.includes(candidate.userID) || user.followedUsers.includes(candidate.userID)) {
        return -Infinity;
    }

    // Rank posts using created recommendation algorithm
    const candidatePosts = await prisma.post.findMany({ where: { authorID: candidate.userID } });
    const setCandidatePosts = (updatedPosts) => {
        candidatePosts = updatedPosts;
    };

    // Average post scores an overall posts score
    scorePosts(candidatePosts, user, setCandidatePosts, RECOMMENDED);
    let totalScore = 0;
    for (const post of candidatePosts) {
        totalScore += post.score;
    }
    const postOvr = totalScore / candidatePosts.length;

    // Vectorize the users' frequency objects and perform a cosine similarity comparison
    const userFreq = user.userFrequency;
    const candidateFreq = candidate.userFrequency;
    // then vectorize
    // then pass insto cosine similarity function
    const similarityScore = 1738; // placeholder

    // Convert the similarity score to a scalar factor
    const similarityFactor = similarityScore < 0 ? -1 + similarityScore : 1 + similarityScore;

    // Find users' following overlap
    const userFollowing = user.followedUsers;
    const candidateFollowing = candidate.followedUsers;
    const followingOverlap = userFollowing.filter((user) => candidateFollowing.includes(user));

    // Hold this overlap against all users they follow to create a mutual following factor
    const followingUnion = new Set(userFollowing.concat(candidateFollowing));
    const mutualFollowFrequency = followingOverlap.length / followingUnion.size;

    // Finalize and return the candidate's score
    const candidateScore = postOvr * similarityFactor * (1 + mutualFollowFrequency);
    return candidateScore;
};
