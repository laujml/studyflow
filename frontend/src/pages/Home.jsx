import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { getErrorMessage } from '../utils/notifications'

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

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L22 20H2L12 2Z" fill="#FF8FAB" opacity="0.3"/>
      <path d="M12 2L22 20H2L12 2Z" stroke="#FF8FAB" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="11" y="9" width="2" height="6" rx="1" fill="#FF8FAB"/>
      <circle cx="12" cy="17" r="1" fill="#FF8FAB"/>
    </svg>
  )
}

function DifficultyBadge({ dificultad }) {
  const map = {
    FACIL: { label: 'Facil', bg: '#DFFAF5', color: '#5bbfb0', border: '#B8F0E6' },
    MEDIA: { label: 'Media', bg: '#E4DCFF', color: '#A090E0', border: '#C9B8FF' },
    DIFICIL: { label: 'Dificil', bg: '#FFE8F1', color: '#FF85A6', border: '#FFB5C8' }
  }
  const s = map[dificultad] || map.MEDIA
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem',
      fontWeight: 700, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, fontFamily: "'Nunito', sans-serif"
    }}>{s.label}</span>
  )
}

function EventTypeBadge({ tipo }) {
  const map = {
    EXAMEN: { label: 'Examen', bg: '#FFE8F1', color: '#FF85A6' },
    ENTREGA: { label: 'Entrega', bg: '#E4DCFF', color: '#A090E0' },
    CLASE: { label: 'Clase', bg: '#DFFAF5', color: '#5bbfb0' },
    OTRO: { label: 'Otro', bg: '#FFF5F9', color: '#9B8AAD' }
  }
  const s = map[tipo] || map.OTRO
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem',
      fontWeight: 700, background: s.bg, color: s.color,
      fontFamily: "'Nunito', sans-serif"
    }}>{s.label}</span>
  )
}

function SectionTitle({ children, color = 'var(--pink)' }) {
  return (
    <h2 style={{
      fontFamily: "'Fredoka One', cursive",
      fontSize: '1.2rem',
      color: 'var(--text)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '14px'
    }}>
      <div style={{ width: 4, height: 18, background: color, borderRadius: 2 }}/>
      {children}
    </h2>
  )
}

function getEventMonth(evento) {
  return new Date(evento.fecha).toLocaleDateString('es', {
    month: 'short',
    timeZone: 'UTC'
  }).toUpperCase()
}

function getEventDay(evento) {
  return new Date(evento.fecha).getUTCDate()
}

function StatCard({ label, value, color, shadow, icon }) {
  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '16px',
      border: `2px solid ${color}`, boxShadow: `3px 3px 0px ${shadow}`,
      display: 'flex', alignItems: 'center', gap: '12px'
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: color, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
        boxShadow: `0 3px 0px ${shadow}`
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem', color: 'var(--text)', lineHeight: 1 }}>{value}</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{label}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/home')
      .then(res => setData(res.data))
      .catch(err => setError(getErrorMessage(err, 'No se pudo cargar el resumen')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Sparkle size={32} color="var(--lila)" style={{ margin: '0 auto 12px' }}/>
        <p style={{ color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>Cargando tu plan...</p>
      </div>
    </div>
  )

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos dias' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  if (error) return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '24px',
      border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)',
      color: 'var(--pink-dark)', fontFamily: "'Nunito', sans-serif", fontWeight: 800
    }}>
      {error}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

      {/* COLUMNA PRINCIPAL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header bienvenida */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px 28px',
          border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)',
          position: 'relative', overflow: 'hidden'
        }}>
          <Star size={18} color="#FFD6E3" style={{ position: 'absolute', top: 16, right: 24 }}/>
          <Sparkle size={14} color="#E4DCFF" style={{ position: 'absolute', top: 36, right: 48 }}/>
          <Heart size={14} color="#FFD6E3" style={{ position: 'absolute', bottom: 16, right: 36 }}/>

          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontFamily: "'Nunito', sans-serif", marginBottom: 2 }}>{saludo},</p>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '2rem', color: 'var(--text)', marginBottom: '16px' }}>
            {user?.nombre}
          </h1>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Nunito', sans-serif" }}>Progreso de hoy</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pink-dark)', fontFamily: "'Nunito', sans-serif" }}>
                {data?.progreso?.completadas || 0} / {data?.progreso?.total || 0} tareas
              </span>
            </div>
            <div style={{ height: '10px', background: 'var(--cream-dark)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${data?.progreso?.porcentaje || 0}%`,
                background: 'var(--pink)', borderRadius: '10px', transition: 'width 0.5s ease'
              }}/>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px', fontFamily: "'Nunito', sans-serif" }}>
              {data?.progreso?.porcentaje || 0}% completado
            </p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatCard
            label="Tareas pendientes"
            value={data?.planDelDia?.length || 0}
            color="var(--pink-light)"
            shadow="var(--pink)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="white" opacity="0.8"/><path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          />
          <StatCard
            label="Proximos eventos"
            value={data?.proximosEventos?.length || 0}
            color="var(--lila-light)"
            shadow="var(--lila)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" fill="white" opacity="0.3"/><rect x="3" y="4" width="18" height="6" rx="3" fill="white" opacity="0.8"/><rect x="7" y="2" width="2" height="4" rx="1" fill="white"/><rect x="15" y="2" width="2" height="4" rx="1" fill="white"/></svg>}
          />
          <StatCard
            label="Cursos activos"
            value={data?.cursos?.length || 0}
            color="var(--mint-light)"
            shadow="var(--mint-dark)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="20" rx="3" fill="white" opacity="0.3"/><rect x="3" y="3" width="4" height="20" rx="2" fill="white" opacity="0.8"/><rect x="9" y="8" width="9" height="2" rx="1" fill="white"/><rect x="9" y="13" width="6" height="2" rx="1" fill="white"/></svg>}
          />
        </div>

        {/* Plan del día */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px',
          border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <SectionTitle color="var(--pink)">Plan de hoy</SectionTitle>
            <Link to="/tareas" style={{ fontSize: '0.8rem', color: 'var(--pink-dark)', fontWeight: 700, textDecoration: 'none', fontFamily: "'Nunito', sans-serif" }}>
              Ver todas
            </Link>
          </div>
          {data?.planDelDia?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
              <Star size={28} color="var(--pink-light)" style={{ margin: '0 auto 8px' }}/>
              <p style={{ marginBottom: 8 }}>No tienes tareas pendientes</p>
              <Link to="/tareas" style={{ color: 'var(--pink-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                Agregar una tarea
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.planDelDia?.map((tarea, i) => (
                <div key={tarea.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '14px',
                  background: tarea.alerta ? '#FFF5F7' : 'var(--cream)',
                  border: `2px solid ${tarea.alerta ? 'var(--pink-light)' : 'var(--cream-dark)'}`,
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: ['var(--pink)', 'var(--lila)', 'var(--mint-dark)', '#FFD6E3', '#E4DCFF'][i % 5],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 0px ${['var(--pink-dark)', 'var(--lila-dark)', '#5bbfb0', 'var(--pink-dark)', 'var(--lila-dark)'][i % 5]}`
                  }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif" }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif", marginBottom: 2 }}>
                      {tarea.nombre}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <DifficultyBadge dificultad={tarea.dificultad}/>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                        {tarea.tiempoEstimado}h
                      </span>
                      {tarea.curso && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--lila-dark)', fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
                          {tarea.curso.nombre}
                        </span>
                      )}
                    </div>
                  </div>
                  {tarea.alerta && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertIcon/>
                      <span style={{ fontSize: '0.7rem', color: '#FF8FAB', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>Urgente</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Frase motivacional */}
        <div style={{
          background: 'var(--pink)', borderRadius: '20px', padding: '20px',
          boxShadow: '4px 4px 0px var(--pink-dark)',
          border: '2px solid var(--pink-dark)',
          position: 'relative', overflow: 'hidden'
        }}>
          <Star size={16} color="white" style={{ position: 'absolute', top: 10, right: 14, opacity: 0.5 }}/>
          <Star size={10} color="white" style={{ position: 'absolute', top: 24, right: 32, opacity: 0.3 }}/>
          <Sparkle size={14} color="white" style={{ position: 'absolute', bottom: 12, right: 20, opacity: 0.4 }}/>
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'white', marginBottom: 6, position: 'relative' }}>
            Tip del dia
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: 'white', opacity: 0.9, lineHeight: 1.5, position: 'relative' }}>
            Empieza por la tarea mas dificil. Tu energia es mayor al inicio del dia.
          </p>
        </div>

        {/* Proximos eventos */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px',
          border: '2px solid var(--lila-light)', boxShadow: '4px 4px 0px var(--lila-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <SectionTitle color="var(--lila)">Proximos eventos</SectionTitle>
            <Link to="/calendario" style={{ fontSize: '0.8rem', color: 'var(--lila-dark)', fontWeight: 700, textDecoration: 'none', fontFamily: "'Nunito', sans-serif" }}>
              Ver todos
            </Link>
          </div>
          {data?.proximosEventos?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
              <p style={{ fontSize: '0.85rem', marginBottom: 6 }}>Sin eventos proximos</p>
              <Link to="/calendario" style={{ color: 'var(--lila-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>
                Agregar evento
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.proximosEventos?.map(evento => (
                <div key={evento.id} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '10px 12px', borderRadius: '12px',
                  background: 'var(--cream)', border: '2px solid var(--lila-light)'
                }}>
                  <div style={{
                    width: '38px', flexShrink: 0, textAlign: 'center',
                    background: 'var(--lila)', borderRadius: '10px', padding: '4px',
                    boxShadow: '0 2px 0px var(--lila-dark)'
                  }}>
                    <p style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                      {getEventMonth(evento)}
                    </p>
                    <p style={{ color: 'white', fontSize: '1rem', fontWeight: 800, fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>
                      {getEventDay(evento)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif", marginBottom: 3 }}>
                      {evento.titulo}
                    </p>
                    <EventTypeBadge tipo={evento.tipo}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis cursos */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px',
          border: '2px solid var(--mint-light)', boxShadow: '4px 4px 0px #B8F0E6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <SectionTitle color="var(--mint-dark)">Mis cursos</SectionTitle>
            <Link to="/cursos" style={{ fontSize: '0.8rem', color: 'var(--mint-dark)', fontWeight: 700, textDecoration: 'none', fontFamily: "'Nunito', sans-serif" }}>
              Ver todos
            </Link>
          </div>
          {data?.cursos?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
              <p style={{ fontSize: '0.85rem', marginBottom: 6 }}>Sin cursos activos</p>
              <Link to="/cursos" style={{ color: 'var(--mint-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>
                Agregar curso
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data?.cursos?.map((curso, i) => (
                <div key={curso.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '12px',
                  background: 'var(--cream)', border: '2px solid var(--mint-light)'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                    background: ['var(--pink)', 'var(--lila)', 'var(--mint-dark)', 'var(--pink-dark)'][i % 4],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 0px ${['var(--pink-dark)', 'var(--lila-dark)', '#5bbfb0', '#cc607a'][i % 4]}`
                  }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif" }}>
                      {curso.nombre.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif" }}>
                      {curso.nombre}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                      {curso.docente}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
