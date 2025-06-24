const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const prisma = new PrismaClient()

router.post('/users/register', async (req, res) => {
    const { username, password: plaintextPassword } = req.query
    const password = await bcrypt.hash(plaintextPassword, 24)
    const user = await prisma.user.create({
        data: {
            username, password
        }
    })
})

module.exports = router
