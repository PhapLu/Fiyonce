import _ from 'lodash'
import {Types} from 'mongoose'
import { User } from '../models/user.model.js'
const convertToObjectIdMongodb = id => Types.ObjectId(id)

const getInfoData = ({fields = [], object = {} }) =>{
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k =>{
        if(obj[k] == null){
            delete obj[k]
        }
    })
    return obj
}

const findByEmail = async ({email, select = {
    email: 1,
    password: 2,
    fullname: 1,
    role: 1
}}) =>{
    return await User.findOne({email}).select(select).lean()
}

const updatedNestedObjectParser = obj => {
    console.log('object:', obj)
    const final = {}
    Object.keys(obj).forEach( k => {
        if(typeof obj[k] ==='Object' && !Array.isArray(obj[k])){
            const response = updatedNestedObjectParser(obj[k])
            Object.keys(response).forEach(a =>{
                final[`${k}.${a}`] = res[a]
            })
        }else{
            final[k] = obj[k]
        }
    })
    console.log(final)
    return final
}

export {
    getInfoData, getSelectData, 
    unGetSelectData, removeUndefinedObject, 
    updatedNestedObjectParser, convertToObjectIdMongodb,
    findByEmail
}

