const multer = require('multer')
const path = require('path')

const MAX_FILE_SIZE = Number(process.env.MAX_UPLOAD_SIZE_BYTES || 10 * 1024 * 1024)

const ALLOWED_FILES = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.gif': ['image/gif'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.ppt': ['application/vnd.ms-powerpoint'],
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation']
}

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const allowedMimeTypes = ALLOWED_FILES[ext]

  if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
    return cb(Object.assign(new Error('Tipo de archivo no permitido'), { status: 400 }))
  }

  cb(null, true)
}

const uploadArchivo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
})

module.exports = { uploadArchivo, MAX_FILE_SIZE }
