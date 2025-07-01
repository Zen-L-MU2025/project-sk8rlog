import { useState } from 'react'

import { CLIPS, BLOGS, DEFAULT } from '/src/utils/constants'

import '/src/css/createPostModal.css'

const CreatePostModal = ({ toggleCreatePostModal }) => {
    const handleForm = (formData) => {


        toggleCreatePostModal()
    }
    const [postType, setPostType] = useState(DEFAULT)

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
                    <input type='file' id='clip' name='clip' accept='video/*' />
                    <input type='text' name='description' placeholder='Description (50 character maximum)' maxLength={50} required />

                </>}

                { postType === BLOGS && <>
                    <input type='text' name='Title' placeholder='Title (50 character maximum)' maxLength={50} required />
                    <textarea type='long_text' name='Content' placeholder='Description (300 character maximum)' maxLength={300} required />
                </>}


                { postType !== DEFAULT &&
                    <button type='submit'>Upload</button>
                }
            </form>
        </section>
    )
}

export default CreatePostModal
