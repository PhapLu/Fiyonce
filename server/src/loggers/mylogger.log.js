import winston, { format, createLogger, transports } from 'winston'
const {combine, timestamp, json, align, printf} = winston.format
import 'winston-daily-rotate-file'
import {v4 as uuidv4} from 'uuid'

class MyLogger{
    constructor(){
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata}) => {
                return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
            }
        )

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize:'1m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize:'1m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrint
                    ),
                    level: 'error'
                })
            ]
        })
    }

    commonParams(params){
        let context, req, metadata;
        if(!Array.isArray(params)){
            context = params
        }else{
            [context, req, metadata] = params
        }

        const requestId = req?.requestId || uuidv4()
        return{
            requestId,
            context,
            metadata
        }
    }

    log(message, params){
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramsLog)

        this.logger.info(logObject)
    }
    error(message, params){
        const paramsLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramsLog)

        this.logger.error(logObject)
    }
}

export default new MyLogger()