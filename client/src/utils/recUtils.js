const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'
import { removeStopwords, eng } from 'stopword'
import { LIKE, NON_ALPHANUMERIC_REGEX, MILLISECONDS_IN_DAY, AGE_CUTOFF_IN_DAYS } from './constants.js'

// Tokenize the content of a post, remove stop words
// If the user has liked the post, increment the frequency of the tokens in the post; decrement if user is unliking
// Store updated frequency in user.user_Frequency
export const tokenize = async (post, activeUser, action) => {
    const user_Frequency = activeUser.user_Frequency || {}
    const frequencyFactor = action === LIKE ? 1 : -1

    const content = post.description
    const filteredContent = await filter(content)

    const tokensUsedInThisInstance = []

    filteredContent.forEach(token => {

        // If the token is not in the user's frequency map, initialize it
        if (!user_Frequency[token]) {
            user_Frequency[token] = {}
        }

        // Modify the absolute frequency of the token
        // +1 if the user liked the post, -1 if the user unliked the post
        user_Frequency[token]["totalFrequencyAcrossLikedPosts"] = (user_Frequency[token].totalFrequencyAcrossLikedPosts || 0) + frequencyFactor

        // For every unique token in the post, increment/decrement the total number of posts the token is present in by 1/-1
        if (!tokensUsedInThisInstance.includes(token)) {
                user_Frequency[token].likedPostsPresentIn = (user_Frequency[token].likedPostsPresentIn || 0) + frequencyFactor
                tokensUsedInThisInstance.push(token)
        }
    })

    return user_Frequency
}

// Score every post based on the user's frequency map
export const scorePosts = async (posts, activeUser, setPosts) => {
    const userFrequency = activeUser.user_Frequency

    // If the user has no liked posts, return
    if (!userFrequency) {
        return
    }

    posts = posts?.filter(post => {
        const postAgeInMS = new Date() - new Date(post.creationDate)
        const postAgeInDays = Math.floor(postAgeInMS / MILLISECONDS_IN_DAY)
        post["ageInDays"] = postAgeInDays
        return postAgeInDays < AGE_CUTOFF_IN_DAYS
    })

    posts?.forEach(async post => {
        let rawPostScore = 0

        const filteredPostContent = await filter(post.description)
        let overlap = {}

        // For each unique token in the post, check if it is in the user's frequency map and add to overlap
        // Increment the frequency of this token
        filteredPostContent.forEach(token => {
            if (userFrequency[token]) {
                overlap[token] = {
                    "frequency" : (overlap[token] ? overlap[token].frequency :  0) + 1,
                    "score" : 0
                }
            }
        })

        // Calculate the interest factor of the post based on overlap size
        const interestFactor = Object.keys(overlap).length / filteredPostContent.length

        // For each token in the overlap, calculate its score and add it to the raw post score
        for (const [tokenName, token] of Object.entries(overlap)) {
            const base = token.frequency * userFrequency[tokenName].likedPostsPresentIn

            // This token holds no weight, skip it
            if (base === 0) {
                continue
            }

            // Account for repetition factor and time factor
            const repetitionFactor = 1 / ( userFrequency[tokenName].totalFrequencyAcrossLikedPosts / userFrequency[tokenName].likedPostsPresentIn )
            // Default the time factor to 1 if the post is less than a day old
            const timeFactor = 1 / Math.sqrt( post.ageInDays > 0 ? post.ageInDays : 1 )
            const tokenScore = base * repetitionFactor * timeFactor
            rawPostScore += tokenScore
        }

        // Apply interest factor to raw post score to get the final score
        const finalScore = rawPostScore * interestFactor
        post["score"] = finalScore
    })

    // Sort posts by score; if two posts share the same score, sort by creation date
    posts = posts.toSorted((a, b) => {
        if (a.score === b.score) {
            return (new Date(b.creationDate) - new Date(a.creationDate))
        }
        return b.score - a.score
    })

    console.log(posts)
    await setPosts(posts)
}

const filter = async (content) => {
    // Convert to lowercase, remove non-alphanumeric characters
    const contentToArray = await new String(content).toLowerCase().split(NON_ALPHANUMERIC_REGEX)
    // remove stop words and further filter resulting tokens < 3 characters long
    const filteredContent = await removeStopwords(contentToArray).filter(token => token.length > 2)
    return filteredContent
}
