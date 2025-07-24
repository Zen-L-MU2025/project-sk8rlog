// Calculate's a token's score based on frequency across liked posts, repretition across liked posts, and time since its post was made
const calculateTokenScore = async (post, token, tokenName, userFrequency) => {
    const base = token.frequency * userFrequency[tokenName].likedPostsPresentIn;

    // This token holds no weight, skip it
    if (base === 0) {
        return 0;
    }

    // Account for repetition factor and time factor
    const repetitionRatio = userFrequency[tokenName].totalFrequencyAcrossLikedPosts / userFrequency[tokenName].likedPostsPresentIn;
    const repetitionFactor = 1 / (!isNaN(repetitionRatio) ? repetitionRatio : 1);

    // Default the time factor to 1 if the post is less than a day old
    const timeFactor = 1 / Math.sqrt(post.ageInDays > 0 ? post.ageInDays : 1);

    const tokenScore = base * repetitionFactor * timeFactor;
    return tokenScore;
};

export default calculateTokenScore;
