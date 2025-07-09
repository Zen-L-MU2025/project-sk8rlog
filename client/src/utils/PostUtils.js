const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'
import { tokenize } from './tokenization.js'

// Uploads a post, starting with the file attachment to GCS and then the full post data to server
// Updates user's posts array state when complete
export const uploadPost = async ( postType, formData, userID, location ) => {
    const textContent = await formData.get('textContent')
    const file = await formData.get('postFile')

    let fileFormData = await new FormData()
    await fileFormData.append('postFile', file)

    let fileURL = ''

    await axios.post(`${baseUrl}/posts/uploadFile`, fileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
        .then(res => {
            fileURL = res.data.fileURL
        })
        .catch(error => {
            console.error("uploadFile error: ", error)
        })

    await axios.post(`${baseUrl}/posts/create/${userID}`, { textContent, location, postType, fileURL })
}

// Provided a userID, gets all posts for that user by specified postType and sets the userPosts array state
export const getUserPostsByType = async ( activeUser, postType, setUserPosts ) => {
    await axios.get(`${baseUrl}/posts/by/${activeUser.userID}/${postType}`)
        .then(res => {
            setUserPosts(res.data.posts.toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate)))
        })
        .catch(error => {
            console.error("getUserPostsByType error: ", error)
        })
}

// Gets all posts by specified postType and sets the posts array state
export const getAllPostsByType = async ( postType, setPosts ) => {
    await axios.get(`${baseUrl}/posts/all/${postType}`)
        .then(res => {
            setPosts(res.data.posts.toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate)))
        })
        .catch(error => {
            console.error("getUserPostsByType error: ", error)
        })
}

// Provided a postID, gets the post data and sets the single post state
export const getPostByID = async ( postID, setPost ) => {
    await axios.get(`${baseUrl}/posts/single/${postID}`)
        .then(res => {
            setPost(res.data.post)
        })
        .catch(error => {
            console.error("getPostByID error: ", error)
        })
}

// Provided a postID, deletes the post and updates the user's posts array state
export const deletePost = async ( post, setUserPosts ) => {
    const postIDtoDelete = post.postID
    const fileURL = post.fileURL

    await axios.delete(`${baseUrl}/posts/delete/${postIDtoDelete}`)
        .then(() => {
            setUserPosts(userPosts => userPosts.filter(post => post.postID !== postIDtoDelete))
        })
        .catch(error => {
            console.error("deletePost/DB error: ", error)
        })

    await axios.delete(`${baseUrl}/posts/deleteFile`, { data : { fileURL } })
        .catch(error => {
            console.error("deletePost/File: ", error)
        })
}

// Handles data related to liking/unliking a post
export const handleLikeOrUnlikePost = async (event, post, action, activeUser, setActiveUser) => {
    const LIKE = "like"
    const UNLIKE = "unlike"
    let updatedUser = {}
    const postID = post.postID

    event.preventDefault()

    switch (action) {
        case LIKE:
            likePost( postID, activeUser, setActiveUser )
            tokenize(post)
            break

        case UNLIKE:
            unlikePost( postID, activeUser, setActiveUser )
            break

        default:
            console.error('Invalid handleLikeOrUnlike action')
    }
}

const likePost = async ( postID, activeUser, setActiveUser ) => {
    const updatedUser = {...activeUser, likedPosts: activeUser.likedPosts ? [...activeUser.likedPosts, postID] : [postID]}

    setActiveUser(updatedUser)
    sessionStorage.setItem("user", JSON.stringify(updatedUser))

    // add to likedPosts
    await axios.put(`${baseUrl}/users/${activeUser.userID}/likedPosts/like`, { postID })
        .catch(error => {
            console.error("handleLikeOrUnlikePost error: ", error)
        })

    // increment post's like count
    await axios.put(`${baseUrl}/posts/${postID}/likes/increment`)
        .catch(error => {
            console.error("handleLikeOrUnlikePost error: ", error)
        })

}

const unlikePost = async ( postID, activeUser, setActiveUser ) => {
    const newLikedPosts = activeUser.likedPosts.filter(pID => pID !== postID)
    const updatedUser = {...activeUser, likedPosts: newLikedPosts}

    setActiveUser(updatedUser)
    sessionStorage.setItem("user", JSON.stringify(updatedUser))

    // remove from likedPosts
    await axios.put(`${baseUrl}/users/${activeUser.userID}/likedPosts/unlike`, { postID })
        .catch(error => {
            console.error("handleLikeOrUnlikePost error: ", error)
        })

    // decrement post's like count
    await axios.put(`${baseUrl}/posts/${postID}/likes/decrement`)
        .catch(error => {
            console.error("handleLikeOrUnlikePost error: ", error)
        })


}
