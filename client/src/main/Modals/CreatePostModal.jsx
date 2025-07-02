import { useState, useEffect, useContext } from 'react'

import UserContext from '/src/utils/UserContext'
import { loadUserSession } from '/src/utils/UserUtils'
import { uploadPost } from '/src/utils/PostUtils'
import { CLIPS, BLOGS, DEFAULT } from '/src/utils/constants'

import '/src/css/createPostModal.css'

const CreatePostModal = ({ toggleCreatePostModal, userPosts, setUserPosts }) => {
    const { activeUser, setActiveUser } = useContext(UserContext)
    useEffect( () => {
        const load = async () => { await loadUserSession(setActiveUser) }
        load()
    }, [])

    const [postType, setPostType] = useState(DEFAULT)

    const handleForm = (formData) => {
        uploadPost(postType, formData, activeUser.userID, activeUser.location, userPosts, setUserPosts)
        toggleCreatePostModal()
    }

    const handleSelect = (event) => {
        setPostType(event.target.value)
    }

    return (
        <section id='createPostModal' onClick={toggleCreatePostModal}>
            <form id='createModalContent' onClick={(event) => event.stopPropagation()} action={handleForm}>
                <h2>New Post!</h2>
                <select id='postType' onChange={handleSelect}>
                    <option value={DEFAULT}>Select Post Type</option>
                    <option value={CLIPS}>Clip</option>
                    <option value={BLOGS}>Blog</option>
                </select>

                { postType === CLIPS && <>
                    <div className='upload'>
                        <p className='message'>Select a clip to upload:</p>
                        <input type='file' id='clip' name='postFile' accept='video/*' required/>
                    </div>
                    <input type='text' name='textContent' placeholder='What are we looking at? (50 char. maximum)' maxLength={50} required />

                </>}

                { postType === BLOGS && <>
                    <input type='file' id='header' name='postFile' accept='image/*' />
                    <textarea type='long_text' name='textContent' placeholder='Speak your truth (in 300 char. or less)!' maxLength={300} required />
                </>}


                { postType !== DEFAULT &&
                    <button type='submit'>Upload</button>
                }
            </form>
        </section>
    )
}

export default CreatePostModal
