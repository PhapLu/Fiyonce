import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import router from "./routes/index.js";
import configureSocket from './configs/socket.config.js';
import SocketServices from './services/socket.service.js';
import './db/init.mongodb.js'; // Ensure this is properly set up
import {v4 as uuidv4} from 'uuid'
//import myLogger from './loggers/mylogger.log.js';
const app = express();

// Init middlewares
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Advanced Logger (not necessary right now)
// app.use((req, res, next)=> {
//     const requestId = req.headers['x-request-id']
//     req.requestId = requestId ? requestId : uuidv4()
//     myLogger.log(`input-params ::${req.method}::`, [
//         req.path,
//         { requestId: req.requestId},
//         req.method === 'POST' ? req.body : req.query
//     ])

//     next()
// }) 
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
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
configureSocket(server);

global._io.on('connection', SocketServices.connection);

// // Start the server
// const PORT = process.env.PORT || 3052;
// server.listen(PORT, () => {
//     console.log(`Server is starting with Port: ${PORT}`);
// });

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
});

export default app;