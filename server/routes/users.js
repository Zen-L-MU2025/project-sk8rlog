const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const prisma = new PrismaClient()

router.use('/register', async (req, res) => {
    const { username, password: plaintextPassword } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { username } })

        if (user) {
            return res.status(403).json({ message: 'Username taken!', isSuccessful: false })
        }

        const password = await bcrypt.hash(plaintextPassword, 11)
        const newUser = await prisma.user.create({
            data: {
                username, password
            }
        })
        return res.status(201).json({ newUser, isSuccessful: true })

    } catch (error) {
        return res.status(500).json({ message: error.message, isSuccessful: false })
    }
})

router.use('/login', async (req, res) => {
    const { username, password: plaintextPassword } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { username } })
        let passwordMatch = false
        user && (passwordMatch = await bcrypt.compare(plaintextPassword, user.password))
        if (!user || !passwordMatch) {
            return res.status(403).json({ message: 'Invalid username or password', isSuccessful: false })
        }

        return res.status(200).json({ user, isSuccessful: true })

    } catch (error) {
        return res.status(500).json({ message: error.message, isSuccessful: false })
    }
})

module.exports = router
