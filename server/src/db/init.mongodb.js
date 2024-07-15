import dotenv from 'dotenv'
dotenv.config()
import mongoose, { mongo } from 'mongoose'
import { countConnect } from '../helpers/check.connect.js'
import configMongodb from '../configs/config.mongodb.js'
const {host, name, port} = configMongodb.db
const connectString = `mongodb://${host}:${port}/${name}`

class Database{
    constructor(){
        this.connect()
    }
    //connect
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }
        mongoose.connect(connectString).then( _ => console.log(`Connected to MongoDB Success`, countConnect()))
        .catch( err => console.log(`Error Connect!`))
    }
    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb