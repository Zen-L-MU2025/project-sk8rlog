const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const STATUS_CODES = require('../statusCodes')

const prisma = new PrismaClient()

// POST /users/register
// Takes desired username and password and creates a new user, returns the new user object and confirmation boolean
router.use('/register', async (req, res) => {
    const { username, password: plaintextPassword } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { username } })

        if (user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Username taken!', isSuccessful: false })
        }

        const password = await bcrypt.hash(plaintextPassword, 11)
        const newUser = await prisma.user.create({
            data: {
                username, password
            }
        })
        return res.status(STATUS_CODES.CREATED).json({ newUser, isSuccessful: true })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

// POST /users/login
// Takes username and password and returns the user object and confirmation boolean
router.use('/login', async (req, res) => {
    const { username, password: plaintextPassword } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { username } })
        let passwordMatch = false
        user && (passwordMatch = await bcrypt.compare(plaintextPassword, user.password))
        if (!user || !passwordMatch) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid username or password', isSuccessful: false })
        }

        return res.status(parseInt(STATUS_CODES.OK)).json({ user, isSuccessful: true })

    } catch (error) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
