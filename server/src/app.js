import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import http from 'http'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import {v4 as uuidv4} from 'uuid'
import bodyParser from 'body-parser'
import compression from 'compression'
import router from "./routes/index.js"
import cookieParser from 'cookie-parser'
import './db/init.mongodb.js'
import myLogger from './loggers/mylogger.log.js'
import configureSocket from './configs/socket.config.js'
import SocketServices from './services/socket.service.js'
import sanitizeInputs from './middlewares/sanitize.middleware.js'
import { globalLimiter, authLimiter, uploadLimiter } from './configs/rateLimit.config.js'
const app = express()

//Rate Limit
app.use(globalLimiter)

// Init middlewares
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet()) // Using Helmet
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"]
  }
}))
app.use(compression())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(sanitizeInputs)

//Advanced Logger
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']
    req.requestId = requestId ? requestId : uuidv4()

    myLogger.log(`input-params ::${req.method}::`, [
        req.path,
        { requestId: req.requestId },
        (req.method === 'POST' || req.method === 'PATCH') ? req.body : req.query
    ])

    next()
})

// Init routes
app.use('', router)

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId},
        { message: error.message}
    ])
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        // stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})

// Create HTTP server
const server = http.createServer(app)

// Configure Socket.IO
configureSocket(server)

global._io.on('connection', SocketServices.connection)

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
})

export default app