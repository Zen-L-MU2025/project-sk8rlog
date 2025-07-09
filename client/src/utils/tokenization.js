const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'
import { removeStopwords, eng } from 'stopword'

export const tokenize = async (post) => {
    const content = post.description

    // Split the content by non-alphanumeric characters
    const contentToArray = content.split(/[^a-zA-Z0-9]/)

    // Filter out stopwords
    const filteredContent = removeStopwords(contentToArray)

    let post_Frequency = {}
    filteredContent.forEach(token => {
        // Further filter <3 character tokens
        if (token.length > 2) {
            post_Frequency[token] = (post_Frequency[token] || 0) + 1
        }
    })

}
