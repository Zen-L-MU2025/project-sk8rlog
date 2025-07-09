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

    const filteredContent = removeStopwords(contentToArray)

    const tokensUsedInThisInstance = []

    filteredContent.forEach(token => {
        // Further filter <3 character tokens
        if (token.length > 2) {

            if (!user_Frequency[token]) {
                user_Frequency[token] = {}
            }

            user_Frequency[token]["totalFrequencyAcrossLikedPosts"] = (user_Frequency[token]["totalFrequencyAcrossLikedPosts"] || 0) + frequencyFactor

            if (!tokensUsedInThisInstance.includes(token)) {
                    user_Frequency[token]["likedPostsPresentIn"] = (user_Frequency[token]["likedPostsPresentIn"] || 0) + frequencyFactor
                    tokensUsedInThisInstance.push(token)
            }

        }
    })

    return user_Frequency
}
