const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const {
  getTareas,
  createTarea,
  updateTarea,
  completarTarea,
  deleteTarea
} = require('../controllers/tareas.controller')

router.use(authMiddleware)

router.get('/', getTareas)
router.post('/', createTarea)
router.put('/:id', updateTarea)
router.patch('/:id/completar', completarTarea)
router.delete('/:id', deleteTarea)

module.exports = router