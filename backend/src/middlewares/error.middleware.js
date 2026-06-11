function notFoundHandler(req, res, next) {
  next(Object.assign(new Error('Ruta no encontrada'), { status: 404 }))
}

function errorHandler(error, req, res, next) {
  const status = error.code === 'LIMIT_FILE_SIZE'
    ? 400
    : error.status || error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'
  const message = error.code === 'LIMIT_FILE_SIZE'
    ? 'El archivo supera el tamano maximo permitido'
    : status >= 500
    ? 'Ocurrio un error inesperado'
    : error.message || 'Solicitud invalida'

  if (!isProduction) {
    console.error(`[${req.method} ${req.originalUrl}]`, error)
  } else if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}] ${error.message}`)
  }

  res.status(status).json({
    error: message,
    ...(isProduction || !error.details ? {} : { details: error.details })
  })
}

module.exports = { notFoundHandler, errorHandler }
