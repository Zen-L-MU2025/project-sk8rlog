const router = require('express').Router()

const webtoken = require('jsonwebtoken')
const TOKEN_SECRET = process.env.TOKEN_SECRET

const STATUS_CODES = require('../statusCodes')

const GCS = require('../utils/GCS')

router.use('/verify', async (req, res, next) => {
    try {
        // Extract the JWT token from the request header
        // TODO Find better way to accomplish this
        const token = req.headers.authorization.split(' ')[1]

        // Verify the token
        webtoken.verify(token, TOKEN_SECRET, (error) => {
            if (error) {
                return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message, isSuccessful: false })
            }

            res.status(STATUS_CODES.OK).json({ message: 'Token verified successfully', isSuccessful: true })
            next()
        })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

router.use('/setCookie', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        await res.cookie('webtoken', token, { Domain: "localhost", Path: "/", maxAge: 3600000, })
        res.status(STATUS_CODES.OK).json({ message: 'Cookie created', isSuccessful: true })
        next()

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

router.use('/testUpload', async (req, res, next) => {
    try {
        const filePath = process.env.DUMMY_FILE_PATH
        const objURL = await GCS.uploadFile(filePath, process.env.DUMMY_FILE_NAME)

        objURL && res.status(STATUS_CODES.OK).json({ message: 'Object created', objURL, isSuccessful: true })
        !objURL && res.status(STATUS_CODES.SERVER_ERROR).json({ message: 'Object not created', isSuccessful: false })

        next()

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
