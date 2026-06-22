import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// SVG Decoraciones kawaii
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

function BookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="4" width="24" height="26" rx="3" fill="white" opacity="0.9"/>
      <rect x="4" y="4" width="4" height="26" rx="2" fill="white" opacity="0.5"/>
      <rect x="10" y="10" width="12" height="2" rx="1" fill="#FFB5C8"/>
      <rect x="10" y="15" width="12" height="2" rx="1" fill="#C9B8FF"/>
      <rect x="10" y="20" width="8" height="2" rx="1" fill="#B8F0E6"/>
    </svg>
  )
}

// Mini ventana kawaii decorativa
function KawaiiWindow({ title, children, style = {} }) {
  return (
    <div style={{
      background: 'var(--dark-surface)',
      borderRadius: '12px',
      border: '2px solid var(--pink-light)',
      overflow: 'hidden',
      boxShadow: '4px 4px 0px var(--pink-light)',
      ...style
    }}>
      <div style={{
        background: 'var(--pink)',
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const authMessage = sessionStorage.getItem('studyflow:authMessage')
    if (authMessage) {
      setMessage(authMessage)
      sessionStorage.removeItem('studyflow:authMessage')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError('Correo o contrasena incorrectos')
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

      {/* Nubes de fondo */}
      <Cloud size={120} color="var(--decor-cloud-light)" style={{ position: 'fixed', top: '5%', left: '-2%', opacity: 0.9 }}/>
      <Cloud size={90} color="var(--decor-cloud-light)" style={{ position: 'fixed', top: '12%', right: '5%', opacity: 0.84 }}/>
      <Cloud size={70} color="var(--decor-flower-light)" style={{ position: 'fixed', bottom: '20%', left: '5%', opacity: 0.88 }}/>
      <Cloud size={100} color="var(--decor-cloud-light)" style={{ position: 'fixed', bottom: '5%', right: '-2%', opacity: 0.78 }}/>

      {/* Estrellas y sparkles */}
      <Star size={22} color="var(--decor-star-light)" style={{ position: 'fixed', top: '15%', left: '15%' }}/>
      <Star size={14} color="var(--decor-star-light)" style={{ position: 'fixed', top: '30%', right: '18%' }}/>
      <Star size={18} color="var(--decor-star-light)" style={{ position: 'fixed', bottom: '30%', right: '15%' }}/>
      <Sparkle size={18} color="var(--decor-sparkle-light)" style={{ position: 'fixed', top: '22%', left: '25%' }}/>
      <Sparkle size={14} color="var(--decor-flower-light)" style={{ position: 'fixed', bottom: '35%', left: '18%' }}/>
      <Sparkle size={20} color="var(--decor-sparkle-light)" style={{ position: 'fixed', top: '60%', right: '12%' }}/>

      {/* Corazones */}
      <Heart size={18} color="var(--decor-heart-light)" style={{ position: 'fixed', top: '40%', left: '8%' }}/>
      <Heart size={14} color="var(--decor-heart-light)" style={{ position: 'fixed', bottom: '42%', right: '20%' }}/>

      {/* Flores */}
      <Flower size={36} color="var(--decor-flower-light)" style={{ position: 'fixed', top: '8%', left: '40%' }}/>
      <Flower size={28} color="var(--decor-flower-light)" style={{ position: 'fixed', bottom: '10%', left: '35%' }}/>

      {/* Mini ventanas decorativas */}
      <KawaiiWindow title="Materias" style={{
        position: 'fixed', top: '15%', left: '3%', width: '140px',
        transform: 'rotate(-6deg)', opacity: 0.85
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Matematicas', 'Historia', 'Ingles'].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#FFB5C8','#C9B8FF','#B8F0E6'][i] }}/>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>{m}</span>
            </div>
          ))}
        </div>
      </KawaiiWindow>

      <KawaiiWindow title="Calendario" style={{
        position: 'fixed', bottom: '18%', right: '4%', width: '130px',
        transform: 'rotate(5deg)', opacity: 0.85
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <span key={i} style={{ fontSize: '0.5rem', color: 'var(--pink-dark)', fontWeight: 700, textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>{d}</span>
          ))}
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
            <span key={n} style={{
              fontSize: '0.5rem', textAlign: 'center',
              color: n === 5 ? 'white' : 'var(--text-light)',
              background: n === 5 ? 'var(--pink)' : 'transparent',
              borderRadius: '50%', padding: '1px',
              fontFamily: "'Nunito', sans-serif"
            }}>{n}</span>
          ))}
        </div>
      </KawaiiWindow>

      <KawaiiWindow title="Mis notas" style={{
        position: 'fixed', bottom: '15%', left: '4%', width: '120px',
        transform: 'rotate(-4deg)', opacity: 0.8
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[80, 60, 90, 50].map((w, i) => (
            <div key={i} style={{ height: 4, width: `${w}%`, background: ['#FFD6E3','#E4DCFF','#DFFAF5','#FFD6E3'][i], borderRadius: 2 }}/>
          ))}
        </div>
      </KawaiiWindow>

      {/* Formulario principal */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--pink)',
            marginBottom: '14px',
            boxShadow: '0 6px 20px rgba(255, 181, 200, 0.5), 0 0 0 6px var(--pink-light)'
          }}>
            <BookIcon />
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: '2.2rem',
            color: 'var(--text)',
            letterSpacing: '0.5px'
          }}>Flora</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: 4 }}>
            Tu asistente academico personal
          </p>
        </div>

        {/* Card principal */}
        <div style={{
          background: 'var(--dark-surface)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '6px 6px 0px var(--pink-light), 0 8px 32px rgba(255, 181, 200, 0.15)',
          border: '2px solid var(--pink-light)',
          position: 'relative'
        }}>
          {/* Decoración esquina */}
          <Flower size={28} color="var(--decor-flower-light)" style={{ position: 'absolute', top: -14, right: 24 }}/>
          <Star size={16} color="var(--decor-star-light)" style={{ position: 'absolute', top: -8, right: 60 }}/>

          <h2 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: '1.6rem',
            color: 'var(--text)',
            marginBottom: '22px'
          }}>Bienvenida de vuelta</h2>

          {error && (
            <div style={{
              background: 'var(--pink-inner)',
              border: '2px solid var(--pink-light)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '14px',
              color: 'var(--pink-accent-dark)',
              fontSize: '0.85rem',
              fontFamily: "'Nunito', sans-serif"
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              background: 'var(--mint-inner)',
              border: '2px solid var(--mint-light)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '14px',
              color: 'var(--mint-ink)',
              fontSize: '0.85rem',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '6px',
                fontFamily: "'Nunito', sans-serif"
              }}>Correo electronico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid var(--pink-light)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: "'Nunito', sans-serif",
                  color: 'var(--text)',
                  background: 'var(--cream)',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                onBlur={e => e.target.style.borderColor = 'var(--pink-light)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '6px',
                fontFamily: "'Nunito', sans-serif"
              }}>Contrasena</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '2px solid var(--pink-light)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: "'Nunito', sans-serif",
                  color: 'var(--text)',
                  background: 'var(--cream)',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                onBlur={e => e.target.style.borderColor = 'var(--pink-light)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: '2px solid var(--pink-dark)',
                background: loading ? 'var(--pink-light)' : 'var(--pink)',
                color: 'var(--text-strong)',
                fontSize: '1rem',
                fontWeight: '800',
                fontFamily: "'Nunito', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 0px var(--pink-dark)',
                marginTop: '6px',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 0px var(--pink-dark)' }}}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 0px var(--pink-dark)' }}
              onMouseDown={e => { e.target.style.transform = 'translateY(2px)'; e.target.style.boxShadow = '0 2px 0px var(--pink-dark)' }}
              onMouseUp={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 0px var(--pink-dark)' }}
            >
              {loading ? 'Iniciando...' : 'Iniciar sesion'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif" }}>
          No tienes cuenta?{' '}
          <Link to="/register" style={{
            color: 'var(--pink-dark)',
            fontWeight: '800',
            textDecoration: 'none'
          }}>
            Registrate aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
