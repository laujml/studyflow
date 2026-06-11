const prisma = require('../prismaClient')
const { ordenarPorPrioridad, tieneTiempoSuficiente } = require('../services/prioridad.service')

const DIFICULTADES_PERMITIDAS = ['FACIL', 'MEDIA', 'DIFICIL']

function validarPayloadTarea({ nombre, fechaLimite, dificultad, tiempoEstimado }) {
  const fecha = new Date(fechaLimite)
  const tiempo = parseFloat(tiempoEstimado)

  if (!nombre?.trim()) return { error: 'El nombre de la tarea es requerido' }
  if (Number.isNaN(fecha.getTime())) return { error: 'La fecha limite no es valida' }
  if (!DIFICULTADES_PERMITIDAS.includes(dificultad)) return { error: 'La dificultad no es valida' }
  if (Number.isNaN(tiempo) || tiempo <= 0) return { error: 'El tiempo estimado no es valido' }

  return { fecha, tiempo }
}

const getTareas = async (req, res) => {
  try {
    const tareas = await prisma.tarea.findMany({
      where: { userId: req.userId },
      include: { curso: { select: { nombre: true } } }
    })

    const pendientes = ordenarPorPrioridad(tareas).map(t => ({
      ...t,
      alerta: !tieneTiempoSuficiente(t)
    }))

    const completadas = tareas
      .filter(t => t.completada)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json([...pendientes, ...completadas])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' })
  }
}

const createTarea = async (req, res) => {
  const { nombre, fechaLimite, dificultad, tiempoEstimado, cursoId } = req.body
  try {
    const validacion = validarPayloadTarea({ nombre, fechaLimite, dificultad, tiempoEstimado })
    if (validacion.error) return res.status(400).json({ error: validacion.error })

    if (cursoId) {
      const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
      if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    }

    const tarea = await prisma.tarea.create({
      data: {
        nombre: nombre.trim(),
        fechaLimite: validacion.fecha,
        dificultad,
        tiempoEstimado: validacion.tiempo,
        cursoId: cursoId || null,
        userId: req.userId
      }
    })
    res.status(201).json(tarea)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' })
  }
}

const updateTarea = async (req, res) => {
  const { id } = req.params
  const { nombre, fechaLimite, dificultad, tiempoEstimado, cursoId } = req.body
  try {
    const validacion = validarPayloadTarea({ nombre, fechaLimite, dificultad, tiempoEstimado })
    if (validacion.error) return res.status(400).json({ error: validacion.error })

    const tarea = await prisma.tarea.findFirst({ where: { id, userId: req.userId } })
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

    if (cursoId) {
      const curso = await prisma.curso.findFirst({ where: { id: cursoId, userId: req.userId } })
      if (!curso) return res.status(404).json({ error: 'Curso no encontrado' })
    }

    const tareaActualizada = await prisma.tarea.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        fechaLimite: validacion.fecha,
        dificultad,
        tiempoEstimado: validacion.tiempo,
        cursoId: cursoId || null
      }
    })
    res.json(tareaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' })
  }
}

const completarTarea = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await prisma.tarea.findFirst({ where: { id, userId: req.userId } })
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

    const tareaCompletada = await prisma.tarea.update({
      where: { id },
      data: { completada: true }
    })
    res.json(tareaCompletada)
  } catch (error) {
    res.status(500).json({ error: 'Error al completar tarea' })
  }
}

const deleteTarea = async (req, res) => {
  const { id } = req.params
  try {
    const tarea = await prisma.tarea.findFirst({ where: { id, userId: req.userId } })
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

    await prisma.tarea.delete({ where: { id } })
    res.json({ mensaje: 'Tarea eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' })
  }
}

module.exports = { getTareas, createTarea, updateTarea, completarTarea, deleteTarea }
