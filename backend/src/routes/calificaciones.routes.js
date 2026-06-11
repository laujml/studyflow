const express = require('express')
const router = express.Router({ mergeParams: true })
const authMiddleware = require('../middlewares/auth.middleware')
const {
  getCalificaciones,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
} = require('../controllers/calificaciones.controller')

router.use(authMiddleware)

router.get('/', getCalificaciones)
router.post('/', createCalificacion)
router.put('/:calificacionId', updateCalificacion)
router.delete('/:calificacionId', deleteCalificacion)

module.exports = router
