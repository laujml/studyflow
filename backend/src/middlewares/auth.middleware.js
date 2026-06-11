const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!process.env.JWT_SECRET) {
    return next(Object.assign(new Error('Configuracion de autenticacion incompleta'), { status: 500 }))
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload.userId) {
      return res.status(401).json({ error: 'Sesion invalida o expirada' })
    }

    req.userId = payload.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Sesion invalida o expirada' })
  }
}

module.exports = authMiddleware
