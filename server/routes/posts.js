const { PrismaClient } = require('../generated/prisma');
const router = require('express').Router()
const STATUS_CODES = require('../statusCodes')
const { QUICKTIME, MOV } = require('../constants')
const GCS = require('../utils/GCS')

const Multer = require('multer')
const multer = Multer({
    storage: Multer.memoryStorage()
})

const prisma = new PrismaClient()

// POST /posts/uploadFile
// Uploads a pending post's file to GCS and returns the URL
router.post('/uploadFile', multer.single('postFile'), async (req, res, next) => {
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
router.post('/create/:userID', async (req, res, next) => {
    try {
        const { userID } = req.params
        const { textContent, location, postType, fileURL } = req.body

        const post = await prisma.post.create({
            data: {
                authorID: userID, description: textContent, location, type: postType, fileURL
            }
        })

        return res.status(STATUS_CODES.CREATED).json({ post, message: 'Post created' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/by/:userID/:type
// Retrieves all posts by specified user of specified type
router.get('/by/:userID/:type', async (req, res, next) => {
    try {
        const { userID, type } = req.params

        const posts = await prisma.post.findMany({
            where: { authorID: userID, type }
        })

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/all/:type
// Retrieves *all* posts of specified type
router.get('/all/:type', async (req, res, next) => {
    try {
        const { type } = req.params

        const posts = await prisma.post.findMany({
            where: { type }
        })

        if (posts.length < 1) {
            return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'No posts found' })
        }

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error })
    }
})

// GET /posts/single/:postID
// Retrieves a post by its ID in the database
router.get('/single/:postID', async (req, res, next) => {
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

module.exports = router
