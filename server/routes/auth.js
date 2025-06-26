const router = require('express').Router()

const webtoken = require('jsonwebtoken')
const TOKEN_SECRET = process.env.TOKEN_SECRET

const STATUS_CODES = require('../statusCodes')

router.use('/verify', async (req, res) => {
    try {
        // Extract the JWT token from the request header
        const token = req.headers.authorization.split(' ')[1]

        // Verify the token
        webtoken.verify(token, TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message, isSuccessful: false })
            }
            else {
                return res.status(STATUS_CODES.OK).json({ message: 'Token verified successfully', isSuccessful: true })
            }
        })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
