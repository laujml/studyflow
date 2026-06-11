const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')

function generarToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error('Configuracion de autenticacion incompleta'), { status: 500 })
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

function validarCredencialesRegistro({ email, password, nombre }) {
  if (!nombre?.trim() || !email?.trim() || !password) {
    return 'Nombre, email y contrasena son requeridos'
  }

  if (password.length < 6) {
    return 'La contrasena debe tener al menos 6 caracteres'
  }

  return null
}

const register = async (req, res) => {
  const { email, password, nombre } = req.body
  const validationError = validarCredencialesRegistro({ email, password, nombre })
  if (validationError) return res.status(400).json({ error: validationError })

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const userExiste = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (userExiste) {
      return res.status(400).json({ error: 'El email ya esta registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        nombre: nombre.trim()
      }
    })

    const token = generarToken(user.id)

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre }
    })
  } catch (error) {
    console.error('Error al registrar usuario:', error.message)
    res.status(error.status || 500).json({ error: 'Error al registrar usuario' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'Email y contrasena son requeridos' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' })
    }

    const passwordValida = await bcrypt.compare(password, user.passwordHash)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales invalidas' })
    }

    const token = generarToken(user.id)

    res.json({
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre }
    })
  } catch (error) {
    console.error('Error al iniciar sesion:', error.message)
    res.status(error.status || 500).json({ error: 'Error al iniciar sesion' })
  }
}

module.exports = { register, login }
