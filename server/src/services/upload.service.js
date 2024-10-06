//1. upload file using S3Client
import crypto from "crypto"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteBucketCommand,
} from "../configs/s3.config.js"
import { BadRequestError } from "../core/error.response.js"

const urlImagePublic = "https://d17lvyd50e77qu.cloudfront.net"
const randomImageName = () => crypto.randomBytes(16).toString("hex")
const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        //upload to S3
        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, //file.originalname || 'unknown',
            Body: file.buffer,
            ContentType: "image/jpeg",
        })
        const result = await s3.send(command)
        //export URL
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        })
        const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 })
        return {
            url: `${urlImagePublic}/${imageName}`,
            result,
        }
    } catch (error) {
        console.error("Error uploading image use S3Client::", error)
        throw new BadRequestError("Error uploading image use S3Client")
    }
}

export { uploadImageFromLocalS3 }
