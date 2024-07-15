import dotenv from 'dotenv'
dotenv.config()
import mongoose, { mongo } from 'mongoose'
import { countConnect } from '../helpers/check.connect.js'
import config from '../configs/config.mongodb.js'
const {host, name, port} = config.db
const connectString = process.env.MONGODB_CONNECTION_STRING 

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.set('debug', true); // Enable debugging if needed

        mongoose.connect(connectString, {
        })
        .then(() => {
            console.log('Connected to MongoDB Atlas');
            countConnect(); // Assuming countConnect() checks connection status
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB Atlas:', err);
        });
    }
    
    // connect = async () =>{
    //     try {
    //         await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    //         console.log('Successful connection')
    //     } catch (error) {
    //         console.log('Failed to connect to MongoDB')
    //     }
    // }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb