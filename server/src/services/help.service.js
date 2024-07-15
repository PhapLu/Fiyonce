import { User } from '../models/user.model.js'
import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import HelpTheme from '../models/helpTheme.model.js'
import HelpTopic from '../models/helpTopic.model.js'
import HelpArticle from '../models/helpArticle.model.js'

class HelpService{
    static createHelpTheme = async(adminId, body) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if(!admin) throw new AuthFailureError('Admin not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        if(body.title === '') throw new BadRequestError('Title cannot be empty')

        //3. Create help theme
        const helpTheme = await HelpTheme.create(body)

        return {
            helpTheme
        }
    }

    static createHelpTopic = async(adminId, body) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if(!admin) throw new AuthFailureError('Admin not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        const { helpThemeId } = body
        const helpTheme = await HelpTheme.findById(helpThemeId)
        if(body.title === '') throw new BadRequestError('Title cannot be empty')
        if(!helpTheme) throw new BadRequestError('Help theme not found')

        //3. Create help topic
        const helpTopic = await HelpTopic.create(body)

        return {
            helpTopic
        }
    }

    static createHelpArticle = async(adminId, body) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if(!admin) throw new AuthFailureError('Admin not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        const { helpTopicId } = body
        const helpTopic = await HelpTopic.findById(helpTopicId)
        if(body.title === '') throw new BadRequestError('Title cannot be empty')
        if(!helpTopic) throw new BadRequestError('Help topic not found')

        //3. Create help article
        const helpArticle = await HelpArticle.create(body)

        return {
            helpArticle
        }
    }

    static readHelpTheme = async(helpThemeId) => {
        //1. Check help theme
        const helpTheme = await HelpTheme.findById(helpThemeId)
        if(!helpTheme) throw new NotFoundError('Help theme not found')

        return {
            helpTheme
        }
    }

    static readHelpTopic = async(helpTopicId) => {
        //1. Check help topic
        const helpTopic = await HelpTopic.findById(helpTopicId)
        if(!helpTopic) throw new NotFoundError('Help topic not found')

        return {
            helpTopic
        }
    }

    static readHelpArticle = async(helpArticleId) => {
        //1. Check help article
        const helpArticle = await HelpArticle.findById(helpArticleId)
        if(!helpArticle) throw new NotFoundError('Help article not found')

        return {
            helpArticle
        }
    }

    static readHelpThemes = async() => {
        //1. Get help themes
        const helpThemes = await HelpTheme.find()

        return {
            helpThemes
        }
    }

    static readHelpTopics = async() => {
        //1. Get help topics
        const helpTopics = await HelpTopic.find()

        return {
            helpTopics
        }
    }

    static readHelpArticles = async() => {
        //1. Get help articles
        const helpArticles = await HelpArticle.find()

        return {
            helpArticles
        }
    }

    static updateHelpTheme = async(adminId, helpThemeId, body) => {
        //1. Check admin, helpTheme
        const admin = await User.findById(adminId)
        const helpTheme = await HelpTheme.findById(helpThemeId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpTheme) throw new NotFoundError('Help theme not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        if(body.title === '') throw new BadRequestError('Title cannot be empty')

        //3. Update help theme
        const updatedHelpTheme = await HelpTheme.findByIdAndUpdate
        (helpThemeId, body, {new: true, runValidators: true})
        
        return {
            helpTheme: updatedHelpTheme
        }
    }

    static updateHelpTopic = async(adminId, helpTopicId, body) => {
        //1. Check admin, helpTopic
        const admin = await User.findById(adminId)
        const helpTopic = await HelpTopic.findById(helpTopicId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpTopic) throw new NotFoundError('Help topic not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        if(body.title === '') throw new BadRequestError('Title cannot be empty')

        //3. Update help topic
        const updatedHelpTopic = await HelpTopic.findByIdAndUpdate
        (helpTopicId, body, {new: true, runValidators: true})
        
        return {
            helpTopic: updatedHelpTopic
        }
    }

    static updateHelpArticle = async(adminId, helpArticleId, body) => {
        //1. Check admin, helpArticle
        const admin = await User.findById(adminId)
        const helpArticle = await HelpArticle.findById(helpArticleId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpArticle) throw new NotFoundError('Help article not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Validate the body
        if(body.title === '') throw new BadRequestError('Title cannot be empty')
        if(body.content === '') throw new BadRequestError('Content cannot be empty')

        //3. Update help article
        const updatedHelpArticle = await HelpArticle.findByIdAndUpdate
        (helpArticleId, body, {new: true, runValidators: true})
        
        return {
            helpArticle: updatedHelpArticle
        }
    }

    static deleteHelpTheme = async(adminId, helpThemeId) => {
        //1. Check admin, helpTheme
        const admin = await User.findById(adminId)
        const helpTheme = await HelpTheme.findById(helpThemeId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpTheme) throw new NotFoundError('Help theme not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Delete help theme
        await HelpTheme.findByIdAndDelete(helpThemeId)

        return {
            message: 'Help theme deleted successfully'
        }
    }

    static deleteHelpTopic = async(adminId, helpTopicId) => {
        //1. Check admin, helpTopic
        const admin = await User.findById(adminId)
        const helpTopic = await HelpTopic.findById(helpTopicId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpTopic) throw new NotFoundError('Help topic not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Delete help topic
        await HelpTopic.findByIdAndDelete(helpTopicId)

        return {
            message: 'Help topic deleted successfully'
        }
    }

    static deleteHelpArticle = async(adminId, helpArticleId) => {
        //1. Check admin, helpArticle
        const admin = await User.findById(adminId)
        const helpArticle = await HelpArticle.findById(helpArticleId)

        if(!admin) throw new AuthFailureError('Admin not found')
        if(!helpArticle) throw new NotFoundError('Help article not found')
        if(admin.role !== 'admin') throw new AuthFailureError('You are not an admin')

        //2. Delete help article
        await HelpArticle.findByIdAndDelete(helpArticleId)

        return {
            message: 'Help article deleted successfully'
        }
    }
}

export default HelpService
