const prisma = require('../prismaClient')

const TIPOS_EVENTO_PERMITIDOS = ['EXAMEN', 'ENTREGA', 'CLASE', 'OTRO']

function validarPayloadEvento({ titulo, fecha, fechaFin, tipo }) {
  const inicio = new Date(fecha)
  const fin = fechaFin ? new Date(fechaFin) : null
  const tipoEvento = tipo || 'OTRO'

  if (!titulo?.trim()) return { error: 'El titulo del evento es requerido' }
  if (Number.isNaN(inicio.getTime())) return { error: 'La fecha del evento no es valida' }
  if (fin && Number.isNaN(fin.getTime())) return { error: 'La fecha de fin no es valida' }
  if (fin && fin < inicio) return { error: 'La fecha de fin no puede ser anterior a la fecha inicial' }
  if (!TIPOS_EVENTO_PERMITIDOS.includes(tipoEvento)) return { error: 'El tipo de evento no es valido' }

  return { inicio, fin, tipoEvento }
}

const getEventos = async (req, res) => {
  const { mes, year } = req.query

  try {
    let where = { userId: req.userId }

    if (mes && year) {
      const inicio = new Date(year, mes - 1, 1)
      const fin = new Date(year, mes, 1)
      where.OR = [
        { fecha: { gte: inicio, lt: fin } },
        { fechaFin: { gte: inicio, lt: fin } },
        { AND: [{ fecha: { lt: inicio } }, { fechaFin: { gte: inicio } }] }
      ]
      delete where.userId
      where = { userId: req.userId, OR: where.OR }
    }

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { fecha: 'asc' }
    })
    res.json(eventos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' })
  }
}

const createEvento = async (req, res) => {
  const { titulo, descripcion, fecha, fechaFin, tipo } = req.body
  try {
    const validacion = validarPayloadEvento({ titulo, fecha, fechaFin, tipo })
    if (validacion.error) return res.status(400).json({ error: validacion.error })

    const evento = await prisma.evento.create({
      data: {
        titulo: titulo.trim(),
        descripcion,
        fecha: validacion.inicio,
        fechaFin: validacion.fin,
        tipo: validacion.tipoEvento,
        userId: req.userId
      }
    })
    res.status(201).json(evento)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' })
  }
}

const deleteEvento = async (req, res) => {
  const { id } = req.params
  try {
    const evento = await prisma.evento.findFirst({ where: { id, userId: req.userId } })
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' })

    await prisma.evento.delete({ where: { id } })
    res.json({ mensaje: 'Evento eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' })
  }
}

module.exports = { getEventos, createEvento, deleteEvento }
