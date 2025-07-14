const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'
import { removeStopwords, eng } from 'stopword'
import { getPostByID } from './PostUtils.js'
import {
    LIKE, NON_ALPHANUMERIC_REGEX, MILLISECONDS_IN_DAY, AGE_CUTOFF_IN_DAYS,
    LIKE_WEIGHT, COMMENT_WEIGHT, CLIPS, BLOGS, AVERAGE_WORDS_READ_PER_SECOND
} from './constants.js'

// Tokenize the content of a post, remove stop words
// If the user has liked the post, increment the frequency of the tokens in the post; decrement if user is unliking
// Store updated frequency in user.user_Frequency
export const tokenize = async (post, activeUser, action) => {
    const user_Frequency = activeUser.user_Frequency || {}
    const frequencyFactor = action === LIKE ? 1 : -1

    const content = post.description
    const filteredContent = await filterTokens(content)

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

// Score every post based on the user's frequency map and set client posts state to results
export const scorePosts = async (posts, activeUser, setPosts, isByPopularity) => {
    const userFrequency = activeUser.user_Frequency

    // If the user has never liked a post, manually override the isByPopularity flag to true
    if (activeUser.likedPosts.length === 0) {
        isByPopularity = true
    }

    // Currently disabled to allow for testing
    //posts = filterPostsByCutoff(posts)

    // Find the user's post type bias
    const { portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts } = await calculateBiasFactors(activeUser)
    const portionOfLikedPostsThatAreBlogs = 1 - portionOfLikedPostsThatAreClips

    for ( const post of posts ) {
        let rawPostScore = 0

        const popularityScore = post.likeCount * LIKE_WEIGHT + post.comments?.length * COMMENT_WEIGHT

        const filteredPostContent = await filterTokens(post.description)
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

        // Calculate the relative interest factor of the post based on overlap size
        const relativeInterestFactor = Object.keys(overlap).length / filteredPostContent.length

        // For each token in the overlap, calculate its score and add it to the raw post score
        for (const [tokenName, token] of Object.entries(overlap)) {
            const base = token.frequency * userFrequency[tokenName].likedPostsPresentIn

            // This token holds no weight, skip it
            if (base === 0) {
                continue
            }

            // Account for repetition factor and time factor
            const repetitionRatio = userFrequency[tokenName].totalFrequencyAcrossLikedPosts / userFrequency[tokenName].likedPostsPresentIn
            const repetitionFactor = 1 / ( !isNaN(repetitionRatio) ? repetitionRatio : 1 )

            // Default the time factor to 1 if the post is less than a day old
            const timeFactor = 1 / Math.sqrt( post.ageInDays > 0 ? post.ageInDays : 1 )

            const tokenScore = base * repetitionFactor * timeFactor
            rawPostScore += tokenScore
        }

        // Split the description into tokens representing full words as a post's length
        // Standardize video length as "additional reading" in a post
        let postLength = new String(post.description).split(NON_ALPHANUMERIC_REGEX).length
        if (post.type === CLIPS) {
            const res = await axios.post(`${baseUrl}/posts/clipLength`, { fileURL : post.fileURL})
                .catch(error => console.error(error))
            const clipLength = res.data.clipLength
            const clipLengthAsWordCount = Math.ceil(clipLength * AVERAGE_WORDS_READ_PER_SECOND)
            postLength += clipLengthAsWordCount
        }

        // Calculate post length bias as percentage difference from average length of liked posts
        const postLengthBias = Math.abs(1 - postLength / avgLengthOfLikedPosts)

        // Select appropriate post type bias
        const typeBias = post.type === CLIPS ? portionOfLikedPostsThatAreClips : portionOfLikedPostsThatAreBlogs

        // Calculate bias factor as popularity amplified by type bias and inhibited by disparity from average post length
        const biasFactor = popularityScore * (1 + typeBias) * postLengthBias

        // Apply relative interest factor and bias factor to raw post score to get the final score
        const finalScore = rawPostScore * relativeInterestFactor * biasFactor
        post["score"] = finalScore
        post["popularity"] = popularityScore
    }

    // Sort posts by either recommendation score or popularity
    // Let tie breakers be handled by other option and finally by creation date
    posts = sortByMetric(posts, isByPopularity)

    await setPosts(posts)
}

// Filters out posts that are older than AGE_CUTOFF_IN_DAYS (7) days
const filterPostsByCutoff = (posts) => {
    return posts?.filter(post => {
        const postAgeInMS = new Date() - new Date(post.creationDate)
        const postAgeInDays = Math.floor(postAgeInMS / MILLISECONDS_IN_DAY)
        post["ageInDays"] = postAgeInDays
        return postAgeInDays < AGE_CUTOFF_IN_DAYS
    })
}

const calculateBiasFactors = async (activeUser) => {
    let likedClips = 0
    let likedBlogs = 0
    let totalLikedContentLength = 0
    const likedPostsCount = activeUser.likedPosts?.length

    for(const postID of activeUser.likedPosts) {
        const post = await getPostByID(postID)

        // Split the description into tokens representing full words and add to total length
        const descriptionAsTokens = new String(post.description).split(NON_ALPHANUMERIC_REGEX)
        totalLikedContentLength += descriptionAsTokens.length

        if (post?.type === CLIPS) {
            likedClips++
            const res = await axios.post(`${baseUrl}/posts/clipLength`, { fileURL : post.fileURL})
                .catch(error => console.error(error))
            const clipLength = res.data.clipLength
            const clipLengthAsWordCount = Math.ceil(clipLength * AVERAGE_WORDS_READ_PER_SECOND)
            totalLikedContentLength += clipLengthAsWordCount
        }
        else if (post?.type === BLOGS) {
            likedBlogs++
        }
    }

    if (likedClips + likedBlogs !== likedPostsCount) {
        console.error("findPortionOfLikedPostsThatAreClips: Liked post type distinctions don't add up to total number of liked posts")
    }

    const portionOfLikedPostsThatAreClips = likedClips / likedPostsCount
    const avgLengthOfLikedPosts = totalLikedContentLength / likedPostsCount

    return {portionOfLikedPostsThatAreClips, avgLengthOfLikedPosts}
}

// Filter out stop words and non-alphanumeric characters from the content of a post
const filterTokens = async (content) => {
    // Convert to lowercase, remove non-alphanumeric characters
    const contentToArray = await new String(content).toLowerCase().split(NON_ALPHANUMERIC_REGEX)
    // remove stop words and further filter resulting tokens < 3 characters long
    const filteredContent = await removeStopwords(contentToArray).filter(token => token.length > 2)
    return filteredContent
}

// Sort posts by either recommendation score or popularity
// Let tie breakers be handled by opposite option and finally by creation date
const sortByMetric = (posts, isByPopularity) => {
    return posts.toSorted((a, b) => {
        if (a.score === b.score && a.popularity === b.popularity) {
            return (new Date(b.creationDate) - new Date(a.creationDate))
        }

        if (!isByPopularity) {
            if (a.score !== b.score) {
                return b.score - a.score
            }
            else {
                return b.popularity - a.popularity
            }
        }

        else {
            if (b.popularity !== a.popularity) {
                return b.popularity - a.popularity
            }
            else {
                return b.score - a.score
            }
        }
    })
}
