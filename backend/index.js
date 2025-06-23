const { PrismaClient } = require('./generated/prisma');
const express = require('express');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
    app.use(express.json());
    app.use(cors());

const PORT = 3000;