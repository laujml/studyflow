function calcularPrioridad(tarea) {
  const hoy = new Date()
  const limite = new Date(tarea.fechaLimite)
  const msRestantes = limite - hoy
  const diasRestantes = Math.max(1, msRestantes / (1000 * 60 * 60 * 24))

  const urgencia = 10 / diasRestantes
  const dificultad = { FACIL: 1, MEDIA: 2, DIFICIL: 3 }[tarea.dificultad]

  return (urgencia * 2) + dificultad + tarea.tiempoEstimado
}

function ordenarPorPrioridad(tareas) {
  return tareas
    .filter(t => !t.completada)
    .map(t => ({ ...t, score: calcularPrioridad(t) }))
    .sort((a, b) => b.score - a.score)
}

function tieneTiempoSuficiente(tarea) {
  const hoy = new Date()
  const limite = new Date(tarea.fechaLimite)
  const diasRestantes = (limite - hoy) / (1000 * 60 * 60 * 24)
  return diasRestantes >= tarea.tiempoEstimado
}

module.exports = { calcularPrioridad, ordenarPorPrioridad, tieneTiempoSuficiente }