import PostCategory from "../models/postCategory.model.js";
import CommissionService from "../models/commissionService.model.js";
import { User } from "../models/user.model.js";
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js";
import Post from "../models/post.model.js";

class PostCategoryService {
    static createPostCategory = async (talentId, body) => {
        try {
            //1. Check talent
            console.log(talentId, body)
            const talent = await User.findById(talentId);
            if (!talent) throw new NotFoundError("Talent not found");
            if (talent.role !== "talent")
                throw new BadRequestError("He/She is not a talent");
    
            //2. Validate body
            if (!body.title) throw new BadRequestError("Title is required");
    
            //3. Create service
            const postCategory = new PostCategory({
                title: body.title,
                talentId,
            });
            console.log(postCategory);
            await postCategory.save();
            return {
                postCategory,
            };
        } catch (error) {
            console.log(error)
        }
    };

    static readPostCategories = async (talentId) => {
        //1. Check talent
        const talent = await User.findById(talentId);
        if (!talent) throw new NotFoundError("Talent not found");
        if (talent.role !== "talent")
            throw new BadRequestError("He/She is not a talent");

        //2. Find services
        const postCategories = await PostCategory.find({
            talentId: talentId,
        }).populate("talentId", "stageName avatar");

        return {
            postCategories,
        };
    };

    static updatePostCategory = async (talentId, postCategoryId, body) => {
        //1. Check talent and service
        const talent = await User.findById(talentId);
        const postCategory = await PostCategory.findById(postCategoryId);

        if (!talent) throw new NotFoundError("Talent not found");
        if (!postCategory) throw new NotFoundError("Service not found");
        if (postCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("You can only update your service");

        //2. Validate body
        if (!body.title) throw new BadRequestError("Title is required");

        //3. Update Service
        const updatedPostCategory = await PostCategory.findByIdAndUpdate(
            postCategoryId,
            { $set: body },
            { new: true }
        );

        return {
            postCategory: updatedPostCategory,
        };
    };

    static deletePostCategory = async (talentId, postCategoryId) => {
        //1. Check talent and service
        const talent = await User.findById(talentId);
        const postCategory = await PostCategory.findById(postCategoryId);

        if (!talent) throw new NotFoundError("Talent not found");
        if (!postCategory) throw new NotFoundError("Service not found");
        if (postCategory.talentId.toString() !== talentId)
            throw new AuthFailureError("You can only delete your postCategory");

        //2. Check posts using postCategory before deleting it
        const posts = await Post.find({ postCategoryId: postCategoryId });
        if (posts.length > 0) {
            await Post.deleteMany({ postCategoryId: postCategoryId });
        }

        //3. Delete service
        return await postCategory.deleteOne();
    };
}

export default PostCategoryService;
