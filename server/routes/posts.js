const { PrismaClient } = require('../generated/prisma');
const router = require('express').Router()
const STATUS_CODES = require('../statusCodes')
const { QUICKTIME, MOV, COMMENT, CREATE } = require('../constants')
const { recalculateInteractionAverages } = require('../sessionUtils')
const GCS = require('../utils/GCS')
const { getVideoDurationInSeconds } = require('get-video-duration')

const Multer = require('multer')
const multer = Multer({
    storage: Multer.memoryStorage()
})

const prisma = new PrismaClient()

// GET /posts
// Retrieves all posts in the database
router.get('/', async (req, res, _next) => {
    try {
        const posts = await prisma.post.findMany()

        if (posts.length < 1) {
            return res.status(STATUS_CODES.NO_CONTENT).json({ message: 'No posts found' })
        }

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// POST /posts/uploadFile
// Uploads a pending post's file to GCS and returns the URL
router.post('/uploadFile', multer.single('postFile'), async (req, res, _next) => {
    try {
        if (!req.file) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'No file provided', isSuccessful: false })
        }

        let extension = await new String(req.file.mimetype).split('/')[1]
        if (extension === QUICKTIME) {
            extension = MOV
        }
        const DESTINATION = `${crypto.randomUUID()}.${extension}`
        const objectURL = await GCS.uploadFile(req.file, DESTINATION)

        return res.status(STATUS_CODES.CREATED).json({ fileURL : objectURL, message: 'File uploaded' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// POST /posts/create/:userID
// Uploads a post to the database and subsequently links it to the user through their ID
router.post('/create/:userID', async (req, res, _next) => {
    try {
        const { userID } = req.params
        const { textContent, location, postType, fileURL } = req.body

        const post = await prisma.post.create({
            data: {
                authorID: userID, description: textContent, location, type: postType, fileURL
            }
        })

        // Update the user's interaction data
        await recalculateInteractionAverages(userID, prisma, CREATE)

        return res.status(STATUS_CODES.CREATED).json({ post, message: 'Post created' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/by/:userID/:type
// Retrieves all posts by specified user of specified type
router.get('/by/:userID/:type', async (req, res, _next) => {
    try {
        const { userID, type } = req.params

        const posts = await prisma.post.findMany({
            where: { authorID: userID, type }
        })

        if (posts.length < 1) {
            return res.status(STATUS_CODES.NO_CONTENT).json({ message: 'No posts found' })
        }

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/all/:type
// Retrieves *all* posts of specified type
router.get('/all/:type', async (req, res, _next) => {
    try {
        const { type } = req.params

        const posts = await prisma.post.findMany({
            where: { type }
        })

        if (posts.length < 1) {
            return res.status(STATUS_CODES.NO_CONTENT).json({ message: 'No posts found' })
        }

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/single/:postID
// Retrieves a post by its ID in the database
router.get('/single/:postID', async (req, res, _next) => {
    try {
        const { postID } = req.params
        const post = await prisma.post.findUnique({
            where: { postID }
        })

        if (!post) {
            return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Post not found' })
        }

        return res.status(STATUS_CODES.OK).json({ post, message: 'Post retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// DELETE /posts/delete/:postID
// Deletes a post by its ID in the database
router.delete('/delete/:postID', async (req, res, _next) => {
    try {
        const { postID } = req.params

        await prisma.post.delete({
            where: { postID }
        })

        return res.status(STATUS_CODES.OK).json({ message: 'Post deleted' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// DELETE /posts/deleteFile
// Deletes a post's file from GCS
router.delete('/deleteFile', async (req, res, _next) => {
    try {
        const { fileURL } = req.body
        await GCS.deleteFile(fileURL)

        return res.status(STATUS_CODES.OK).json({ message: 'File deleted' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// PUT /posts/:postID/likes/:action
// Reacts to a post liking interaction by adding or removing a like
router.put('/:postID/likes/:action', async (req, res, _next) => {
    try {
        const INCREMENT = 'increment'
        const { postID, action } = req.params

        const post = await prisma.post.findUnique({ where: { postID : postID } })

        if (!post) {
            return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Post not found' })
        }

        await prisma.post.update({
            where: { postID: postID },
            data: { likeCount: action === INCREMENT ? post.likeCount + 1 : post.likeCount - 1 }
        })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// POST /posts/comments
// Retrieves all comments corresponding to the comment IDs provided
router.post('/comments', async (req, res, _next) => {
    try {
        const { commentIDs } = req.body

        if (commentIDs?.length < 1) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'No comment IDs provided' })
        }

        let comments = []

        for ( const commentID of commentIDs ) {
            const comment = await prisma.comment.findUnique({
                where : { commentID }
            })

            // Retrieve the author of the comment and attach it to the comment object
            const author = await prisma.user.findUnique({
                where : { userID : comment.authorID }
            })
            comment["author"] = author

            comments.push(comment)
        }

        // Sort the comments in descending order by creation date
        comments.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))

        return res.status(STATUS_CODES.OK).json({ comments, message: 'Comments retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// POST /posts/comments/:postID
// Creates a comment for a post, saves it to the database and links it to its corresponding post
router.post('/comments/:postID', async (req, res, _next) => {
    try {
        const { postID } = req.params
        const { commentBoxContent, userID } = req.body

        // Create the comment
        const comment = await prisma.comment.create({
            data: {
                authorID: userID, content: commentBoxContent
            }
        })

        // Link the comment to the post through its ID
        const post = await prisma.post.findUnique({
            where: { postID }
        })
        await prisma.post.update({
            where: { postID },
            data: { comments: [...post.comments, comment.commentID] }
        })

        // Retrieve the author of the comment and attach it to the comment object
        const author = await prisma.user.findUnique({
            where : { userID }
        })
        comment["author"] = author

        // Update the user's interaction data
        await recalculateInteractionAverages(userID, prisma, COMMENT)

        return res.status(STATUS_CODES.CREATED).json({ comment, message: 'Comment created' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// POST /posts/clipLength
// Provided a post's file URL, returns the video length in seconds
router.post('/clipLength', async (req, res, _next) => {
    try {
        const { fileURL } = req.body
        const clipLength = await getVideoDurationInSeconds(fileURL).catch((error) => {console.error(error)})

        res.status(STATUS_CODES.OK).json({ clipLength, message: 'Video length retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})


module.exports = router
