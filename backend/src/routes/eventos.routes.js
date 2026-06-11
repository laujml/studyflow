const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const { getEventos, createEvento, deleteEvento } = require('../controllers/eventos.controller')

router.use(authMiddleware)

router.get('/', getEventos)
router.post('/', createEvento)
router.delete('/:id', deleteEvento)

module.exports = router