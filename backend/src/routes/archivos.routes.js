const express = require('express')
const router = express.Router({ mergeParams: true })
const authMiddleware = require('../middlewares/auth.middleware')
const { uploadArchivo: uploadMiddleware } = require('../middlewares/upload.middleware')
const {
  getArchivos,
  uploadArchivo,
  deleteArchivo
} = require('../controllers/archivos.controller')

router.use(authMiddleware)

router.get('/', getArchivos)
router.post('/', uploadMiddleware.single('archivo'), uploadArchivo)
router.delete('/:archivoId', deleteArchivo)

module.exports = router
