const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const { getHome } = require('../controllers/home.controller')

router.use(authMiddleware)

router.get('/', getHome)

module.exports = router