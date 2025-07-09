import { removeStopwords, eng } from 'stopword'

export const tokenize = async (post, activeUser) => {
    const content = post.description
    const user_Frequency = activeUser.user_Frequency || {}

    // Split the content by non-alphanumeric characters
    const contentToArray = content.split(/[^a-zA-Z0-9]/)

    // Filter out stopwords
    const filteredContent = removeStopwords(contentToArray)

    const tokensUsedInThisInstance = []

    filteredContent.forEach(token => {
        // Further filter <3 character tokens
        if (token.length > 2) {

            if (!user_Frequency[token]) {
                user_Frequency[token] = {}
            }

            user_Frequency[token]["totalFrequencyAcrossLikedPosts"] = (user_Frequency[token]["totalFrequencyAcrossLikedPosts"] || 0) + 1

            if (!tokensUsedInThisInstance.includes(token)) {
                    user_Frequency[token]["likedPostsPresentIn"] = (user_Frequency[token]["likedPostsPresentIn"] || 0) + 1
                    tokensUsedInThisInstance.push(token)
            }

        }
    })

    return user_Frequency
}
