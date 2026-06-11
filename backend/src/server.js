const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const cursosRoutes = require('./routes/cursos.routes')
const tareasRoutes = require('./routes/tareas.routes')
const eventosRoutes = require('./routes/eventos.routes')
const homeRoutes = require('./routes/home.routes')
const calificacionesRoutes = require('./routes/calificaciones.routes')
const archivosRoutes = require('./routes/archivos.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')

const app = express()

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '1mb' }))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursosRoutes)
app.use('/api/cursos/:cursoId/calificaciones', calificacionesRoutes)
app.use('/api/cursos/:cursoId/archivos', archivosRoutes)
app.use('/api/tareas', tareasRoutes)
app.use('/api/eventos', eventosRoutes)
app.use('/api/home', homeRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudyFlow API corriendo' })
})

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
