const express = require('express')
const cors = require('cors')

const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/users', usersRouter)
app.use('/auth', authRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
