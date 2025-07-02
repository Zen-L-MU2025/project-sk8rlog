const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'

// Uploads a post, starting with the file attachment to GCS and then the full post data to server
// Updates user's posts array state when complete
export const uploadPost = async ( postType, formData, userID, location, userPosts, setUserPosts ) => {
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

    await axios.post(`${baseUrl}/posts/${userID}`, { textContent, location, postType, fileURL })
        .then(res => {
            setUserPosts([res.data.post, ...userPosts])
        })
}

// Provided a userID, gets all posts for that user by specified postType and sets the userPosts array state
export const getUserPostsByType = async ( activeUser, postType, setUserPosts ) => {
    await axios.get(`${baseUrl}/posts/${activeUser.userID}/${postType}`)
        .then(res => {
            console.log(res.data.posts)
            setUserPosts(res.data.posts.toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate)))
        })
        .catch(error => {
            console.error("getUserPostsByType error: ", error)
        })
}
