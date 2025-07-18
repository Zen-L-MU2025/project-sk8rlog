const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");

const { enableCORSinBucket } = require("./utils/GCS");
const { createWebSocket } = require("./utils/serverWebSocketUtils");

const corsConfig = {
    origin: "http://localhost:5173",
    credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsConfig));

const sessionConfig = {
    name: "sessionID",
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60,
        // TODO Hold off on securing the cookie until the app is deployed with Render
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    },
    resave: false,
    saveUninitialized: false,
};
app.use(session(sessionConfig));

app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);

const PORT = 3000;

enableCORSinBucket();

// Create HTTP server
const server = createServer(app);

// Init socket instance
createWebSocket(server, corsConfig);

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
