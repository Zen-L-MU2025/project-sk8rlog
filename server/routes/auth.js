// TODO next() is a placeholder in case of some continuation of an endpoint in the future
// Clean this up once during finishing touches

const router = require('express').Router()
const webtoken = require('jsonwebtoken')
const TOKEN_SECRET = process.env.TOKEN_SECRET
const STATUS_CODES = require('../statusCodes')

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
        const auth = req.headers.authorization.split(' ')[1].split(':')
        const token = auth[0]
        const userID = auth[1]

        await res.cookie('webtoken', token, { Domain: "localhost", Path: "/", maxAge: 3600000, })
        await res.cookie('userid', userID, { Domain: "localhost", Path: "/", maxAge: 3600000, })
        res.status(STATUS_CODES.OK).json({ message: 'Cookie created', isSuccessful: true })
        next()

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
