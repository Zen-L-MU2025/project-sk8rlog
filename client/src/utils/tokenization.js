import { removeStopwords, eng } from 'stopword'
import { LIKE } from './constants.js'

// Tokenize the content of a post, remove stop words
// If the user has liked the post, increment the frequency of the tokens in the post; decrement if user is unliking
// Store updated frequency in user.user_Frequency
export const tokenize = async (post, activeUser, action) => {
    const content = post.description
    const user_Frequency = activeUser.user_Frequency || {}

    const frequencyFactor = action === LIKE ? 1 : -1

    const contentToArray = content.split(/[^a-zA-Z0-9]/)

    let filteredContent = removeStopwords(contentToArray)
    // Further filter out tokens < 3 characters long
    filteredContent = filteredContent.filter(token => token.length > 2)

    const tokensUsedInThisInstance = []

    filteredContent.forEach(token => {

        // If the token is not in the user's frequency map, initialize it
        if (!user_Frequency[token]) {
            user_Frequency[token] = {}
        }

        // Modify the absolute frequency of the token
        // +1 if the user liked the post, -1 if the user unliked the post
        user_Frequency[token]["totalFrequencyAcrossLikedPosts"] = (user_Frequency[token]["totalFrequencyAcrossLikedPosts"] || 0) + frequencyFactor

        // For every unique token in the post, increment/decrement the total number of posts the token is present in by 1/-1
        if (!tokensUsedInThisInstance.includes(token)) {
                user_Frequency[token]["likedPostsPresentIn"] = (user_Frequency[token]["likedPostsPresentIn"] || 0) + frequencyFactor
                tokensUsedInThisInstance.push(token)
        }
    })

    return user_Frequency
}
