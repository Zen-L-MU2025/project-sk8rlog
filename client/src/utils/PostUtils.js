const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

import axios from 'axios'

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

    await axios.post(`${baseUrl}/posts/${userID}`, { textContent, location, postType, fileURL })
        .then(res => {
            console.log(res.data.post)
        })
}
