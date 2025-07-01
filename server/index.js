const express = require('express')
const cors = require('cors')
const session = require('express-session')

const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

const sessionConfig = {
    name: 'sessionID',
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60,
        // TODO Hold off on securing the cookie until the app is deployed with Render
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: false
}
app.use(session(sessionConfig))

app.use(express.json())

app.use('/users', usersRouter)
app.use('/auth', authRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
