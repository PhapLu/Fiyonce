import News from "../models/news.model.js"
import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import {
    compressAndUploadImage,
    deleteFileByPublicId,
    extractPublicIdFromUrl,
} from "../utils/cloud.util.js"

class NewsService {
    static createNews = async (adminId, req) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if (!admin) throw new AuthFailureError("Admin not found")
        if (admin.role !== 'admin') throw new AuthFailureError("Unauthorized")

        //2. Validate request body
        if (!req.body.title) throw new BadRequestError("Please provide title")
        if (!req.body.content) throw new BadRequestError("Please provide content")
        if (req.files && !req.files.thumbnail) throw new BadRequestError("Please provide thumbnail")
        if (req.files && req.files.thumbnail.length == 0) throw new BadRequestError("Please provide thumbnail")
        try {
            //3. Upload thumbnail to cloudinary
            const thumbnailUploadResult = await compressAndUploadImage({
                buffer: req.files.thumbnail[0].buffer,
                originalname: req.files.thumbnail[0].originalname,
                folderName: `fiyonce/news/admin`,
                width: 1920,
                height: 1080
            })
            const thumbnail = thumbnailUploadResult.secure_url

            //4. Check if pinned news is at limit(3), if so, unpin the oldest
            if (req.body.isPinned && req.body.isPinned === 'true') {
                const pinnedNews = await News.find({ isPinned: true })
                if (pinnedNews.length >= 3) {
                    const oldestPinnedNews = pinnedNews.sort((a, b) => a.createdAt - b.createdAt)[0]
                    oldestPinnedNews.isPinned = false
                    await oldestPinnedNews.save()
                }
            }

            //5. Create news
            const news = new News({
                thumbnail,
                ...req.body
            })
            await news.save()

            return {
                news
            }
        } catch (error) {
            console.error(`Error in NewsService.createNews(): ${error}`)
            throw new BadRequestError("Error creating news")
        }
    }

    static readNews = async (newsId) => {
        //1. Check news
        const news = await News.findById(newsId)
        if (!news) throw new NotFoundError("News not found")

        //2. Increment views
        news.views += 1
        await news.save()

        return {
            news
        }
    }

    static readNewss = async () => {
        //1. Read pinned news and the rest
        const newss = await News.find().sort({ isPinned: -1, createdAt: -1 })


        return {
            newss
        }
    }

    static updateNews = async (adminId, newsId, req) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if (!admin) throw new AuthFailureError("Admin not found")
        if (admin.role !== 'admin') throw new AuthFailureError("Unauthorized")

        //2. Check if news exists
        const news = await News.findById(newsId)
        if (!news) throw new NotFoundError("News not found")

        try {
            //3. Upload thumbnail to cloudinary
            if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
                const thumbnailToDelete = news.thumbnail
                console.log(thumbnailToDelete);
                const thumbnailUploadResult = await compressAndUploadImage({
                    buffer: req.files.thumbnail[0].buffer,
                    originalname: req.files.thumbnail[0].originalname,
                    folderName: `fiyonce/news/admin`,
                    width: 1920,
                    height: 1080
                })
                const thumbnail = thumbnailUploadResult.secure_url

                //4. Delete old thumbnail
                const oldThumbnailPublicId = extractPublicIdFromUrl(thumbnailToDelete)
                await deleteFileByPublicId(oldThumbnailPublicId)
                news.thumbnail = thumbnail
            }

            //4. Check if pinned news is at limit(3), if so, unpin the oldest
            if (req.body.isPinned && req.body.isPinned === 'true') {
                const pinnedNews = await News.find({ isPinned: true })
                if (pinnedNews.length >= 3) {
                    const oldestPinnedNews = pinnedNews.sort((a, b) => a.createdAt - b.createdAt)[0]
                    oldestPinnedNews.isPinned = false
                    await oldestPinnedNews.save()
                }
            }

            //5. Update news
            news.title = req.body.title || news.title
            news.subTitle = req.body.subTitle || news.subTitle
            news.content = req.body.content || news.content
            news.isPinned = req.body.isPinned || news.isPinned
            news.isPrivate = req.body.isPrivate || news.isPrivate
            await news.save()

            return {
                news
            }
        } catch (error) {
            console.error(`Error in NewsService.updateNews(): ${error}`)
            throw new BadRequestError("Error updating news")
        }
    }

    static deleteNews = async (adminId, newsId) => {
        //1. Check admin
        const admin = await User.findById(adminId)
        if (!admin) throw new AuthFailureError("Admin not found")
        if (admin.role !== 'admin') throw new AuthFailureError("Unauthorized")

        //2. Check if news exists
        const news = await News.findById(newsId)
        if (!news) throw new NotFoundError("News not found")

        //3. Delete thumbnail
        const thumbnailPublicId = extractPublicIdFromUrl(news.thumbnail)
        await deleteFileByPublicId(thumbnailPublicId)

        //4. Delete news
        await news.deleteOne()

        return {
            news
        }
    }
}

export default NewsService