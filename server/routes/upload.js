const express = require('express')
const router = express.Router()
console.log('Upload route loaded')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const authMiddleware = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Няма файл' })

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'petfinder' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })

    res.json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ error: 'Грешка при качване' })
  }
})

module.exports = router