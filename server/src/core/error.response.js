const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}
import myLogger from '../loggers/mylogger.log.js'
import {statusCodes, reasonPhrases} from '../utils//httpStatusCode.js'

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
        this.now = Date.now()
        //Log the error use winston
        myLogger.error(this.message, ['api/v1/login', 'vv33344', {error: 'Bad request error'}])
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT){
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor(message = reasonPhrases.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED){
        super( message, statusCode)
    }
}
class NotFoundError extends ErrorResponse{
    constructor(message = reasonPhrases.NOT_FOUND, statusCode = statusCodes.NOT_FOUND){
        super( message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse{
    constructor(message = reasonPhrases.FORBIDDEN, statusCode = statusCodes.FORBIDDEN){
        super( message, statusCode)
    }
} 

export {ErrorResponse, ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError, ForbiddenError}

