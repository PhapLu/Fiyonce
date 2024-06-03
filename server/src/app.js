import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import router from "./routes/index.js";
const app = express()
//Init middlewares
app.use(cors({
    origin:["http://localhost:5173", "https://vapi.vnappmob.com"],
    methods:"GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
  },
));
app.use(express.json());
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Init db
import './db/init.mongodb.js'


//Init routes
app.use('', router);
//Error handling
app.use((req, res, next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) =>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

export default app