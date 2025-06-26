import { useState } from 'react';

import Header from '/src/main/Header'
import Sidebar from '/src/main/Sidebar'
import ProfileHead from './ProfileHead'
import ProfilePostsView from './ProfilePostsView'
import Footer from '/src/main/Footer'

import '/src/css/hasSidebar.css'

const Profile = () => {
    const headerText = `User's Profile`
    const CLIPS = "clips"
    const BLOGS = "blogs"

    const [isViewingClips, setIsViewingClips] = useState(true)
    const [isViewingBlogs, setIsViewingBlogs] = useState(false)
    const toggleContentView = (option) => {
        switch (option) {
            case CLIPS:
                setIsViewingClips(true)
                setIsViewingBlogs(false)
                break

            case BLOGS:
                setIsViewingClips(false)
                setIsViewingBlogs(true)
                break

            default:
                console.error("Invalid option for toggleContentView")
        }
    }

    return (<>
        <Header headerText={headerText} />
        <section className='pageMain'>
            <Sidebar />
            <div className='profileContent'>
                <ProfileHead toggleContentView={toggleContentView}/>
                <ProfilePostsView isViewingClips={isViewingClips} isViewingBlogs={isViewingBlogs} />
            </div>

        </section>

        <Footer />

    </>)
}

export default Profile
