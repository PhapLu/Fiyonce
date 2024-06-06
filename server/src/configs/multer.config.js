import multer from 'multer'

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
})

const uploadMemory = multer({
    storage: multer.memoryStorage()
})

const uploadFields = uploadMemory.fields([
    { name: 'files', maxCount: 5 },
    { name: 'portfolioLink', maxCount: 1 },
    { name: 'phone', maxCount: 1 },
    { name: 'stageName', maxCount: 1 },
    { name: 'price', maxCount: 1 },
]);

export {
    uploadDisk,
    uploadFields,
    uploadMemory
}