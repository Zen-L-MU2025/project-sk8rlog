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
router.post('/uploadFile', multer.single('postFile'), async (req, res) => {
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
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

// POST /posts/:userID
// Uploads a post to the database and subsequently links it to the user through their ID
router.post('/:userID', async (req, res, next) => {
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
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

router.get('/:userID/:type', async (req, res, next) => {
    try {
        const { userID, type } = req.params

        const posts = await prisma.post.findMany({
            where: { authorID: userID, type }
        })

        return res.status(STATUS_CODES.OK).json({ posts, message: 'Posts retrieved' })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
