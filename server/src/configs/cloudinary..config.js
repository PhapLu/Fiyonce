import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NODE_ENV === "production" ? process.env.CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME_DEV,
    api_key: process.env.NODE_ENV === "production" ? process.env.CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY_DEV,
    api_secret: process.env.NODE_ENV === "production" ? process.env.CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET_DEV,
    secure: true,
});

export default cloudinary;
