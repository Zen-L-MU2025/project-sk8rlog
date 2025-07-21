from flask import Flask, request, jsonify
from gensim.models import KeyedVectors
from numpy import dot
from numpy.linalg import norm
import numpy as np

# Load the Google News word2vec model
model_path = 'GoogleNews-vectors-negative300.bin'
model = KeyedVectors.load_word2vec_format(model_path, binary=True)

# Vectorizes each keyword in a user frequency object and averages out all vectors as an embedding for that particualr user
def vectorize(keywords, frequencies):
    vectors = []
    collectiveWeight = 0

    for i, word in enumerate(keywords):
        if word in model:
            vector = model[word]

            # Compute weight based on repetition factor and add to collective weight
            repetitionWeight = 1
            if frequencies[word]["likedPostsPresentIn"] != 0:
                repetitionWeight += 1 / (frequencies[word]["totalFrequencyAcrossLikedPosts"] / frequencies[word]["likedPostsPresentIn"])
            collectiveWeight += repetitionWeight

            # Add vector to list with weight applied
            vectors.append(vector * repetitionWeight)

        # Otherwise, the word just isn't in the model, nothing to do here (yet?)

    if not vectors or collectiveWeight == 0:
        return np.zeros(model.vector_size)

    # Average out all vectors as one
    averageOfVectors = np.sum(vectors, axis=0) / collectiveWeight
    return averageOfVectors


app = Flask(__name__)

# Default
@app.route("/")
def root():
    return "ROOT"

# Create vector embeddings for user and candidate frequency objects and send results in response
@app.route("/embedUserFrequency", methods=['POST'])
def embedUserFrequency():
    data = request.get_json()
    # Vectorization returns a NumPy array, standardize this to a normal array that can be processed into JSON using tolist()
    userFrequencyEmbedding = vectorize(data["userKeywords"], data["userFrequency"]).tolist()
    candidateFrequencyEmbedding = vectorize(data["candidateKeywords"], data["candidateFrequency"]).tolist()

    # Compute cosine similarity score as dot product of embeddings divided by the product of their normal vectorizations
    userNorm = norm(userFrequencyEmbedding)
    candidateNorm = norm(candidateFrequencyEmbedding)

    # If either user has never liked a post, fall back to 0
    if userNorm == 0 or candidateNorm == 0:
        cosineSimilarityScore = 0
    else:
        cosineSimilarityScore = dot(userFrequencyEmbedding, candidateFrequencyEmbedding) / (userNorm * candidateNorm)

    return jsonify({
        "userFrequencyEmbedding" : userFrequencyEmbedding,
        "candidateFrequencyEmbedding" : candidateFrequencyEmbedding,
        "dimension" : len(userFrequencyEmbedding),
        "cosineSimilarityScore" : cosineSimilarityScore
    })

if __name__ == "__main__":
    app.run()
