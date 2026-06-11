const prisma = require('../prismaClient')

function validarPayloadCalificacion({ nombre, nota, notaMaxima, porcentaje }) {
  const notaNumero = parseFloat(nota)
  const notaMaximaNumero = parseFloat(notaMaxima)
  const porcentajeNumero = parseFloat(porcentaje)

  if (!nombre?.trim()) return { error: 'El nombre de la calificacion es requerido' }
  if (Number.isNaN(notaNumero) || notaNumero < 0) return { error: 'La nota no es valida' }
  if (Number.isNaN(notaMaximaNumero) || notaMaximaNumero <= 0) return { error: 'La nota maxima no es valida' }
  if (notaNumero > notaMaximaNumero) return { error: 'La nota no puede superar la nota maxima' }
  if (Number.isNaN(porcentajeNumero) || porcentajeNumero <= 0 || porcentajeNumero > 100) return { error: 'El porcentaje no es valido' }

  return { notaNumero, notaMaximaNumero, porcentajeNumero }
}

const getCalificaciones = async (req, res) => {
  const { cursoId } = req.params
  try {
    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const calificaciones = await prisma.calificacion.findMany({
      where: { cursoId },
      orderBy: { createdAt: 'asc' }
    })
    res.json(calificaciones)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones' })
  }
}

const createCalificacion = async (req, res) => {
  const { cursoId } = req.params
  const { nombre, nota, notaMaxima, porcentaje } = req.body
  try {
    const validacion = validarPayloadCalificacion({ nombre, nota, notaMaxima, porcentaje })
    if (validacion.error) return res.status(400).json({ error: validacion.error })

    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const calificacion = await prisma.calificacion.create({
      data: {
        nombre: nombre.trim(),
        nota: validacion.notaNumero,
        notaMaxima: validacion.notaMaximaNumero,
        porcentaje: validacion.porcentajeNumero,
        cursoId
      }
    })
    res.status(201).json(calificacion)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear calificacion' })
  }
}

const updateCalificacion = async (req, res) => {
  const { cursoId, calificacionId } = req.params
  const { nombre, nota, notaMaxima, porcentaje } = req.body
  try {
    const validacion = validarPayloadCalificacion({ nombre, nota, notaMaxima, porcentaje })
    if (validacion.error) return res.status(400).json({ error: validacion.error })

    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const calificacion = await prisma.calificacion.findFirst({
      where: { id: calificacionId, cursoId }
    })
    if (!calificacion) return res.status(404).json({ error: 'Calificacion no encontrada' })

    const calificacionActualizada = await prisma.calificacion.update({
      where: { id: calificacionId },
      data: {
        nombre: nombre.trim(),
        nota: validacion.notaNumero,
        notaMaxima: validacion.notaMaximaNumero,
        porcentaje: validacion.porcentajeNumero
      }
    })
    res.json(calificacionActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar calificacion' })
  }
}

const deleteCalificacion = async (req, res) => {
  const { cursoId, calificacionId } = req.params
  try {
    const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })

    const calificacion = await prisma.calificacion.findFirst({
      where: { id: calificacionId, cursoId }
    })
    if (!calificacion) return res.status(404).json({ error: 'Calificacion no encontrada' })

    await prisma.calificacion.delete({ where: { id: calificacionId } })
    res.json({ mensaje: 'Calificacion eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar calificacion' })
  }
}

module.exports = {
  getCalificaciones,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
}
