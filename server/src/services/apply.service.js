import { AuthFailureError, BadRequestError, NotFoundError } from "../core/error.response.js"
import Apply from "../models/apply.model.js"
import { User } from "../models/user.model.js"
import {artwork} from "../models/artwork.model.js"

class ApplyService{
    static submitPortfolio = async(userId, briefId, body) => {
    }
    static readApply = async(applyId) => {
    }
    static readApplies = async() => {
    }
    static updateApply = async(userId, applyId, body) => {
    }

    static deleteApply = async(userId, applyId) => {
    }
    static viewApplyHistory = async(userId) => {
    }
}

export default ApplyService