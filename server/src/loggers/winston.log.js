import winston from 'winston'
const { combine, timestamp, printf, align, json } = winston.format
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        align(),
        printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: 'logs', filename: 'test.log'
        }),
    ]
})

export default logger