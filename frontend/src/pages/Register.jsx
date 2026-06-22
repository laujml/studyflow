import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Cloud({ size = 60, color = '#FFD6E3', style = {} }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none" style={style}>
      <ellipse cx="50" cy="45" rx="45" ry="20" fill={color}/>
      <ellipse cx="30" cy="38" rx="22" ry="18" fill={color}/>
      <ellipse cx="55" cy="32" rx="26" ry="22" fill={color}/>
      <ellipse cx="75" cy="40" rx="18" ry="15" fill={color}/>
    </svg>
  )
}

function Star({ size = 20, color = '#FFB5C8', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 2L13.8 8.2H20.4L15 11.8L16.8 18L12 14.4L7.2 18L9 11.8L3.6 8.2H10.2L12 2Z" fill={color}/>
    </svg>
  )
}

function Sparkle({ size = 16, color = '#C9B8FF', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" fill={color}/>
    </svg>
  )
}

function Heart({ size = 20, color = '#FFB5C8', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 21C12 21 3 14 3 8C3 5.2 5.2 3 8 3C9.8 3 11.4 3.9 12 5.1C12.6 3.9 14.2 3 16 3C18.8 3 21 5.2 21 8C21 14 12 21 12 21Z" fill={color}/>
    </svg>
  )
}

function Flower({ size = 24, color = '#B8F0E6', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
      <ellipse cx="20" cy="8" rx="5" ry="8" fill={color}/>
      <ellipse cx="20" cy="32" rx="5" ry="8" fill={color}/>
      <ellipse cx="8" cy="20" rx="8" ry="5" fill={color}/>
      <ellipse cx="32" cy="20" rx="8" ry="5" fill={color}/>
      <ellipse cx="10" cy="10" rx="5" ry="8" fill={color} transform="rotate(-45 10 10)"/>
      <ellipse cx="30" cy="10" rx="5" ry="8" fill={color} transform="rotate(45 30 10)"/>
      <ellipse cx="10" cy="30" rx="5" ry="8" fill={color} transform="rotate(45 10 30)"/>
      <ellipse cx="30" cy="30" rx="5" ry="8" fill={color} transform="rotate(-45 30 30)"/>
      <circle cx="20" cy="20" r="7" fill="white"/>
      <circle cx="20" cy="20" r="4" fill={color}/>
    </svg>
  )
}

function KawaiiWindow({ title, children, style = {} }) {
  return (
    <div style={{
      background: 'var(--dark-surface)',
      borderRadius: '12px',
      border: '2px solid var(--lila-light)',
      overflow: 'hidden',
      boxShadow: '4px 4px 0px var(--lila-light)',
      ...style
    }}>
      <div style={{
        background: 'var(--lila)',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dark-text)', opacity: 0.8 }}/>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dark-text)', opacity: 0.6 }}/>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dark-text)', opacity: 0.4 }}/>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: 'white', fontWeight: 700, marginLeft: 4 }}>{title}</span>
      </div>
      <div style={{ padding: '10px 12px' }}>{children}</div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  border: '2px solid var(--lila-light)',
  outline: 'none',
  fontSize: '0.9rem',
  fontFamily: "'Nunito', sans-serif",
  color: 'var(--text)',
  background: 'var(--cream)',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
}

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'var(--text)',
  marginBottom: '6px',
  fontFamily: "'Nunito', sans-serif"
}

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', { nombre, email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Nubes */}
      <Cloud size={110} color="var(--decor-cloud-light)" style={{ position: 'fixed', top: '4%', left: '-2%', opacity: 0.9 }}/>
      <Cloud size={85} color="var(--decor-cloud-light)" style={{ position: 'fixed', top: '10%', right: '4%', opacity: 0.84 }}/>
      <Cloud size={75} color="var(--decor-cloud-light)" style={{ position: 'fixed', bottom: '18%', left: '4%', opacity: 0.88 }}/>
      <Cloud size={95} color="var(--decor-flower-light)" style={{ position: 'fixed', bottom: '4%', right: '-2%', opacity: 0.78 }}/>

      {/* Decoraciones */}
      <Star size={20} color="var(--decor-star-light)" style={{ position: 'fixed', top: '18%', left: '14%' }}/>
      <Star size={14} color="var(--decor-star-light)" style={{ position: 'fixed', top: '28%', right: '16%' }}/>
      <Star size={16} color="var(--decor-star-light)" style={{ position: 'fixed', bottom: '28%', right: '14%' }}/>
      <Sparkle size={16} color="var(--decor-sparkle-light)" style={{ position: 'fixed', top: '20%', left: '26%' }}/>
      <Sparkle size={14} color="var(--decor-sparkle-light)" style={{ position: 'fixed', bottom: '32%', left: '16%' }}/>
      <Heart size={16} color="var(--decor-heart-light)" style={{ position: 'fixed', top: '42%', left: '7%' }}/>
      <Heart size={14} color="var(--decor-heart-light)" style={{ position: 'fixed', bottom: '40%', right: '18%' }}/>
      <Flower size={32} color="var(--decor-flower-light)" style={{ position: 'fixed', top: '6%', left: '42%' }}/>
      <Flower size={26} color="var(--decor-flower-light)" style={{ position: 'fixed', bottom: '8%', left: '38%' }}/>

      {/* Mini ventanas */}
      <KawaiiWindow title="Mi progreso" style={{
        position: 'fixed', top: '18%', left: '3%', width: '140px',
        transform: 'rotate(-5deg)', opacity: 0.85
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[{ label: 'Tareas', pct: 75, color: '#C9B8FF' }, { label: 'Cursos', pct: 50, color: '#FFB5C8' }, { label: 'Notas', pct: 90, color: '#B8F0E6' }].map((item, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>{item.label}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>{item.pct}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--dark-border)', borderRadius: 10 }}>
                <div style={{ height: 5, width: `${item.pct}%`, background: item.color, borderRadius: 10 }}/>
              </div>
            </div>
          ))}
        </div>
      </KawaiiWindow>

      <KawaiiWindow title="Tareas" style={{
        position: 'fixed', bottom: '20%', right: '3%', width: '138px',
        transform: 'rotate(4deg)', opacity: 0.85
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {['Estudiar cap. 3', 'Entregar ensayo', 'Repasar formulas'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, border: `2px solid ${['#FFB5C8','#C9B8FF','#B8F0E6'][i]}`, flexShrink: 0 }}/>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>{t}</span>
            </div>
          ))}
        </div>
      </KawaiiWindow>

      {/* Formulario */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--lila)',
            marginBottom: '14px',
            boxShadow: '0 6px 20px rgba(201, 184, 255, 0.5), 0 0 0 6px var(--lila-light)'
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="11" r="6" fill="white" opacity="0.9"/>
              <path d="M4 28C4 22 9.4 18 16 18C22.6 18 28 22 28 28" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2.2rem', color: 'var(--text)', letterSpacing: '0.5px' }}>Flora</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: 4 }}>Crea tu cuenta y empieza a estudiar</p>
        </div>

        <div style={{
          background: 'var(--dark-surface)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '6px 6px 0px var(--lila-light), 0 8px 32px rgba(201, 184, 255, 0.15)',
          border: '2px solid var(--lila-light)',
          position: 'relative'
        }}>
          <Flower size={28} color="var(--decor-flower-light)" style={{ position: 'absolute', top: -14, right: 24 }}/>
          <Star size={16} color="var(--decor-star-light)" style={{ position: 'absolute', top: -8, right: 60 }}/>

          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: 'var(--text)', marginBottom: '22px' }}>
            Crear cuenta
          </h2>

          {error && (
            <div style={{
              background: 'var(--pink-inner)', border: '2px solid var(--pink-light)', borderRadius: '12px',
              padding: '10px 14px', marginBottom: '14px', color: 'var(--pink-accent-dark)',
              fontSize: '0.85rem', fontFamily: "'Nunito', sans-serif"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Como te llamas?"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--lila)'}
                onBlur={e => e.target.style.borderColor = 'var(--lila-light)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--lila)'}
                onBlur={e => e.target.style.borderColor = 'var(--lila-light)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--lila)'}
                onBlur={e => e.target.style.borderColor = 'var(--lila-light)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px',
                border: '2px solid var(--lila-dark)',
                background: loading ? 'var(--lila-light)' : 'var(--lila)',
                color: 'var(--text-strong)', fontSize: '1rem', fontWeight: '800',
                fontFamily: "'Nunito', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 0px var(--lila-dark)',
                marginTop: '6px'
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 0px var(--lila-dark)' }}}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 0px var(--lila-dark)' }}
              onMouseDown={e => { e.target.style.transform = 'translateY(2px)'; e.target.style.boxShadow = '0 2px 0px var(--lila-dark)' }}
              onMouseUp={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 0px var(--lila-dark)' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif" }}>
          Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--lila-dark)', fontWeight: '800', textDecoration: 'none' }}>
            Inicia sesion aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
