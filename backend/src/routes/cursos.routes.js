const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
} = require('../controllers/cursos.controller')

router.use(authMiddleware)

router.get('/', getCursos)
router.get('/:id', getCursoById)
router.post('/', createCurso)
router.put('/:id', updateCurso)
router.delete('/:id', deleteCurso)

module.exports = router