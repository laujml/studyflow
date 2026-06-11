const cloudinary = require('cloudinary').v2
const { Readable } = require('stream')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

function bufferToStream(buffer) {
  const readable = new Readable()
  readable.push(buffer)
  readable.push(null)
  return readable
}

function limpiarNombreArchivo(nombreOriginal) {
  const ext = path.extname(nombreOriginal).toLowerCase()
  const base = path.basename(nombreOriginal, ext)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return {
    base: base || 'archivo',
    ext
  }
}

function subirArchivo(buffer, nombreOriginal, tipo) {
  return new Promise((resolve, reject) => {
    const isImage = tipo?.includes('image')
    const resourceType = isImage ? 'image' : 'raw'
    const { base, ext } = limpiarNombreArchivo(nombreOriginal)
    const publicId = isImage
      ? `${Date.now()}-${base}`
      : `${Date.now()}-${base}${ext}`

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'studyflow',
        resource_type: resourceType,
        public_id: publicId,
        overwrite: false
      },
      (error, result) => {
        if (error) {
          console.error('Error de Cloudinary:', error)
          reject(error)
        } else resolve(result)
      }
    )
    uploadStream.on('error', reject)
    bufferToStream(buffer).pipe(uploadStream)
  })
}

function obtenerPublicIdDesdeUrl(url, tipo) {
  const { pathname } = new URL(url)
  const partes = pathname.split('/').filter(Boolean)
  const uploadIndex = partes.indexOf('upload')
  const publicPath = partes
    .slice(uploadIndex + 1)
    .filter((parte) => !/^v\d+$/.test(parte))
    .join('/')
  const decoded = decodeURIComponent(publicPath)

  if (tipo?.includes('image')) {
    return decoded.replace(/\.[^/.]+$/, '')
  }

  return decoded
}

function eliminarArchivo(publicId, tipo) {
  const resourceType = tipo?.includes('image') ? 'image' : 'raw'
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

async function eliminarArchivoPorUrl(url, tipo) {
  const publicId = obtenerPublicIdDesdeUrl(url, tipo)
  const result = await eliminarArchivo(publicId, tipo)

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error('No se pudo eliminar el archivo en Cloudinary')
  }

  return result
}

module.exports = { subirArchivo, eliminarArchivo, eliminarArchivoPorUrl, obtenerPublicIdDesdeUrl }
