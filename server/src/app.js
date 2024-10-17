import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import router from './routes/index.js';
import myLogger from './loggers/mylogger.log.js';
import configureSocket from './configs/socket.config.js';
import SocketServices from './services/socket.service.js';
import sanitizeInputs from './middlewares/sanitize.middleware.js';
import { globalLimiter, blockChecker } from './configs/rateLimit.config.js';
import './configs/passport.config.js'; // Import passport configuration
import session from 'express-session'
import mongoose from 'mongoose';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Rate Limit
app.use(blockChecker);
app.use(globalLimiter);

// Init middlewares
app.use(cors({
    origin: [process.env.NODE_ENV === 'production' ? process.env.CLIENT_ORIGIN : process.env.CLIENT_LOCAL_ORIGIN],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"]
    }
}));

app.use(compression());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeInputs);

// Initialize session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        sameSite: 'lax', // Protect against CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Init db
import './db/init.mongodb.js';
// import { initRedis } from './db/init.redis.js';
// initRedis()
import { init } from './db/init.ioredis.js';
init({
    IOREDIS_IS_ENABLED: true
})

// Advanced Logger
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'];
    req.requestId = requestId ? requestId : uuidv4();

    myLogger.log(`input-params ::${req.method}::`, [
        req.path,
        { requestId: req.requestId },
        (req.method === 'POST' || req.method === 'PATCH') ? req.body : req.query
    ]);

    next();
});

// Init routes
app.use('', router);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        { message: error.message }
    ]);
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = configureSocket(server);

global._io.on('connection', SocketServices.connection);

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down WebSocket and HTTP connections...');

    // Close WebSocket connections if using Socket.IO
    if (global._io) {
        global._io.close(() => {
            console.log('WebSocket connections closed.');
        });
    }

    // Close MongoDB connection if applicable
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
    });

    // Close HTTP server
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);  // Exit the process properly
    });
});

export default server;


