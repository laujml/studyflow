const prisma = require('../prismaClient')
const { eliminarArchivoPorUrl } = require('../services/cloudinary.service')

const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: { userId: req.userId }
    })
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' })
  }
}

const getCursoById = async (req, res) => {
  const { id } = req.params
  try {
    const curso = await prisma.curso.findFirst({
      where: { id, userId: req.userId },
      include: { calificaciones: true, archivos: true }
    })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    res.json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener curso' })
  }
}

const createCurso = async (req, res) => {
  const { nombre, docente, correo, programa } = req.body
  try {
    if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre del curso es requerido' })

    const curso = await prisma.curso.create({
      data: {
        nombre: nombre.trim(),
        docente: docente || '',
        correo: correo || '',
        programa: programa || '',
        userId: req.userId
      }
    })
    res.status(201).json(curso)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

const updateCurso = async (req, res) => {
  const { id } = req.params
  const { nombre, docente, correo, programa } = req.body
  try {
    const curso = await prisma.curso.findFirst({ where: { id, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const cursoActualizado = await prisma.curso.update({
      where: { id },
      data: {
        nombre: nombre?.trim() || curso.nombre,
        docente: docente || '',
        correo: correo || '',
        programa: programa || ''
      }
    })
    res.json(cursoActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar curso' })
  }
}

const deleteCurso = async (req, res) => {
  const { id } = req.params
  try {
    const curso = await prisma.curso.findFirst({
      where: { id, userId: req.userId },
      include: { archivos: true }
    })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    try {
      await Promise.all(
        curso.archivos.map((archivo) => eliminarArchivoPorUrl(archivo.url, archivo.tipo))
      )
    } catch (error) {
      console.error('Error al eliminar archivos del curso en Cloudinary:', error.message)
      return res.status(500).json({
        error: 'No se pudo eliminar uno o mas archivos del curso. Intentalo de nuevo.'
      })
    }

    await prisma.curso.delete({ where: { id } })
    res.json({ mensaje: 'Curso eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar curso' })
  }
}

module.exports = { getCursos, getCursoById, createCurso, updateCurso, deleteCurso }
