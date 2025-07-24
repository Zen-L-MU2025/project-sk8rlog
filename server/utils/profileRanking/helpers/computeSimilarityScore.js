import { NO_CORRELATION } from "../../constants.js";

// Vectorize the users' frequency objects and performs a cosine similarity comparison to get a similarity score
const computeSimilarityScore = async (user, candidate) => {
    // Vectorize the users' frequency objects and perform a cosine similarity comparison
    const userFrequency = user.user_Frequency || {};
    const candidateFrequency = candidate.user_Frequency || {};

    const userKeywords = Object.keys(userFrequency);
    const candidateKeywords = Object.keys(candidateFrequency);

    let userEmbedding, candidateEmbedding, cosineSimilarityScore;

    // Send data to Python server to generate embeddings and compute cosine similarity
    await fetch("http://localhost:1738/embedUserFrequency", {
        body: JSON.stringify({ userFrequency, candidateFrequency, userKeywords, candidateKeywords }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            userEmbedding = data.userEmbedding;
            candidateEmbedding = data.candidateEmbedding;
            cosineSimilarityScore = isNaN(data.cosineSimilarityScore) ? NO_CORRELATION : data.cosineSimilarityScore;
        })
        .catch((err) => {
            console.log(err);
            cosineSimilarityScore = 0;
        });

    return cosineSimilarityScore;
};

export default computeSimilarityScore;
