const prisma = require('../prismaClient')
const { subirArchivo, eliminarArchivoPorUrl } = require('../services/cloudinary.service')

const getArchivos = async (req, res) => {
  const { cursoId } = req.params
  try {
    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const archivos = await prisma.archivo.findMany({
      where: { cursoId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(archivos)
  } catch (error) {
    console.error('Error completo:', error)
    res.status(500).json({ error: 'Error al obtener archivos' })
  }
}

const uploadArchivo = async (req, res) => {
  const { cursoId } = req.params
  try {
    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' })

    const resultado = await subirArchivo(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    )

    const archivo = await prisma.archivo.create({
      data: {
        nombre: req.file.originalname,
        url: resultado.secure_url,
        tipo: req.file.mimetype,
        cursoId
      }
    })

    res.status(201).json(archivo)
  } catch (error) {
    console.error('Error al subir archivo:', error.message)
    res.status(500).json({ error: 'Error al subir archivo' })
  }
}

const deleteArchivo = async (req, res) => {
  const { cursoId, archivoId } = req.params
  try {
    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const archivo = await prisma.archivo.findFirst({ where: { id: archivoId, cursoId } })
    if (!archivo) return res.status(404).json({ error: 'Archivo no encontrado' })

    await eliminarArchivoPorUrl(archivo.url, archivo.tipo)

    await prisma.archivo.delete({ where: { id: archivoId } })
    res.json({ mensaje: 'Archivo eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar archivo:', error.message)
    res.status(500).json({ error: 'No se pudo eliminar el archivo. Intentalo de nuevo.' })
  }
}

module.exports = { getArchivos, uploadArchivo, deleteArchivo }
