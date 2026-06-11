const prisma = require('../prismaClient')
const { ordenarPorPrioridad, tieneTiempoSuficiente } = require('../services/prioridad.service')

const getHome = async (req, res) => {
  try {
    const tareas = await prisma.tarea.findMany({
      where: { userId: req.userId, completada: false },
      include: { curso: { select: { nombre: true } } }
    })

    const planDelDia = ordenarPorPrioridad(tareas)
      .slice(0, 5)
      .map(t => ({
        ...t,
        alerta: !tieneTiempoSuficiente(t)
      }))

    const ahora = new Date()
    const inicioHoy = new Date(Date.UTC(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate()
    ))

    const proximosEventos = await prisma.evento.findMany({
      where: {
        userId: req.userId,
        OR: [
          { fecha: { gte: inicioHoy } },
          { fechaFin: { gte: inicioHoy } }
        ]
      },
      orderBy: { fecha: 'asc' },
      take: 3
    })

    const cursos = await prisma.curso.findMany({
      where: { userId: req.userId }
    })

    const totalTareas = await prisma.tarea.count({
      where: { userId: req.userId }
    })
    const tareasCompletadas = await prisma.tarea.count({
      where: { userId: req.userId, completada: true }
    })
    const progreso = totalTareas > 0
      ? Math.round((tareasCompletadas / totalTareas) * 100)
      : 0

    res.json({
      planDelDia,
      proximosEventos,
      cursos,
      progreso: {
        completadas: tareasCompletadas,
        total: totalTareas,
        porcentaje: progreso
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del home' })
  }
}

module.exports = { getHome }
