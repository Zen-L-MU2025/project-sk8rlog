// TODO next() is a placeholder in case of some continuation of an endpoint in the future
// Clean this up once during finishing touches

const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const webtoken = require('jsonwebtoken')
const TOKEN_SECRET = process.env.TOKEN_SECRET

const STATUS_CODES = require('../statusCodes')

const prisma = new PrismaClient()

// POST /users/register
// Takes desired username and password and creates a new user, returns the new user object, confirmation boolean, and a token
router.use('/register', async (req, res, next) => {
    const { username, password: plaintextPassword, name, location } = req.body.formObject

    try {
        const user = await prisma.user.findUnique({ where: { username } })

        if (user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Username taken!', isSuccessful: false })
        }

        const password = await bcrypt.hash(plaintextPassword, 11)
        const newUser = await prisma.user.create({
            data: {
                username, password, name, location
            }
        })

        const tokenPayload = { userID: newUser.userID, username: newUser.username}
        const token = await webtoken.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '1h' })

        await res.cookie('webtoken', token, { Domain: "localhost", Path: "/", maxAge: 3600000, })
        res.status(STATUS_CODES.CREATED).json({ newUser, isSuccessful: true, token })
        next()

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

// POST /users/login
// Takes username and password and returns the user object, confirmation boolean, and a token
router.use('/login', async (req, res, next) => {
    const { username, password: plaintextPassword } = req.body.formObject

    try {
        const user = await prisma.user.findUnique({ where: { username } })
        let passwordMatch = false
        user && (passwordMatch = await bcrypt.compare(plaintextPassword, user.password))
        if (!user || !passwordMatch) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid username or password', isSuccessful: false })
        }

        const tokenPayload = { userID: user.userID, username: user.username}
        const token = await webtoken.sign(tokenPayload, TOKEN_SECRET, { expiresIn: '1h' })

        res.status(STATUS_CODES.OK).json({ user, isSuccessful: true, token })
        next()

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

// GET /users/:userID
// Returns the user object for the given userID
router.use('/:userID', async (req, res, next) => {
    const { userID } = req.params
    const user = await prisma.user.findUnique({ where: { userID } })
    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' })
    }

    res.status(STATUS_CODES.OK).json({ user })
})

module.exports = router
