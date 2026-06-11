import { useState, useEffect } from 'react'
import api from '../services/api'
import { getErrorMessage, notify } from '../utils/notifications'

/* ── Decorative ── */
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

/* ── Badge tipo evento ── */
const TIPO_MAP = {
  EXAMEN: { label: 'Examen', bg: '#FFE8F1', color: '#FF85A6', dot: '#FF85A6' },
  ENTREGA: { label: 'Entrega', bg: '#E4DCFF', color: '#A090E0', dot: '#A090E0' },
  CLASE: { label: 'Clase', bg: '#DFFAF5', color: '#5bbfb0', dot: '#5bbfb0' },
  OTRO: { label: 'Otro', bg: '#FFF5F9', color: '#9B8AAD', dot: '#C9B8FF' }
}

function EventTypeBadge({ tipo }) {
  const s = TIPO_MAP[tipo] || TIPO_MAP.OTRO
  return (
    <span style={{
      padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem',
      fontWeight: 700, background: s.bg, color: s.color, fontFamily: "'Nunito', sans-serif"
    }}>{s.label}</span>
  )
}

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(255,200,220,0.35)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '28px',
        width: '100%', maxWidth: '420px',
        border: '2px solid var(--lila-light)', boxShadow: '6px 6px 0px var(--lila-light)',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--cream)',
          border: '2px solid var(--cream-dark)', borderRadius: '50%',
          width: 32, height: 32, cursor: 'pointer', fontWeight: 800,
          color: 'var(--text-light)', fontSize: '1rem', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>×</button>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.3rem', color: 'var(--text)', marginBottom: '20px' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text', as = 'input', min }) {
  const shared = {
    width: '100%', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem',
    border: '2px solid var(--cream-dark)', background: 'var(--cream)',
    fontFamily: "'Nunito', sans-serif", color: 'var(--text)', outline: 'none', boxSizing: 'border-box'
  }
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '5px' }}>{label}</label>
      {as === 'textarea'
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={2} style={{ ...shared, resize: 'vertical' }}/>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} style={shared}/>
      }
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '5px' }}>{label}</label>
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem',
        border: '2px solid var(--cream-dark)', background: 'var(--cream)',
        fontFamily: "'Nunito', sans-serif", color: 'var(--text)', outline: 'none', boxSizing: 'border-box'
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* ── Helpers ── */
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const EMPTY_FORM = { titulo: '', descripcion: '', fecha: '', tipo: 'OTRO', fechaFin: '', esRango: false }

function esEventoEnDia(evento, dia, mes, year) {
  const inicio = new Date(evento.fecha)
  inicio.setHours(0, 0, 0, 0)
  const fin = evento.fechaFin ? new Date(evento.fechaFin) : new Date(inicio)
  fin.setHours(23, 59, 59, 999)
  const d = new Date(year, mes, dia)
  return d >= inicio && d <= fin
}

export default function Calendario() {
  const today = new Date()
  const [mes, setMes] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = () => {
    setLoading(true)
    setLoadError('')
    api.get(`/eventos?mes=${mes + 1}&year=${year}`)
      .then(r => setEventos(r.data))
      .catch(error => {
        const message = getErrorMessage(error, 'No se pudieron cargar los eventos')
        setLoadError(message)
        notify(message, 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [mes, year])

  const navMes = (dir) => {
    setDiaSeleccionado(null)
    if (dir === -1 && mes === 0) { setMes(11); setYear(y => y - 1) }
    else if (dir === 1 && mes === 11) { setMes(0); setYear(y => y + 1) }
    else setMes(m => m + dir)
  }

  const eventosDelDia = (dia) => {
    return eventos.filter(e => esEventoEnDia(e, dia, mes, year))
  }

  const openCreate = (dia = null) => {
    const fechaDefault = dia
      ? `${year}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      : ''
    setForm({ ...EMPTY_FORM, fecha: fechaDefault })
    setShowModal(true)
  }

  const guardar = async () => {
    if (!form.titulo.trim() || !form.fecha) return
    setSaving(true)
    try {
      await api.post('/eventos', {
        titulo: form.titulo,
        descripcion: form.descripcion,
        fecha: form.fecha,
        fechaFin: form.esRango && form.fechaFin ? form.fechaFin : null,
        tipo: form.tipo
      })
      notify('Evento creado')
      setShowModal(false)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo crear el evento'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    try {
      await api.delete(`/eventos/${id}`)
      notify('Evento eliminado')
      setConfirmDelete(null)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo eliminar el evento'), 'error')
    }
  }

  const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const totalDias = getDaysInMonth(year, mes)
  const primerDia = getFirstDayOfMonth(year, mes)
  const diasPrevMonth = primerDia
  const prevMonthDays = getDaysInMonth(year, mes === 0 ? 11 : mes - 1)
  const diasSeleccionados = diaSeleccionado ? eventosDelDia(diaSeleccionado) : []

  if (loadError) return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '24px',
      border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)',
      color: 'var(--pink-dark)', fontFamily: "'Nunito', sans-serif", fontWeight: 800
    }}>
      {loadError}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

      {/* COLUMNA PRINCIPAL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Header mes */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px 24px',
          border: '2px solid var(--lila-light)', boxShadow: '4px 4px 0px var(--lila-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <Star size={16} color="#E4DCFF" style={{ position: 'absolute', top: 12, right: 28 }}/>
          <Sparkle size={11} color="#FFD6E3" style={{ position: 'absolute', bottom: 12, right: 52 }}/>

          <button onClick={() => navMes(-1)} style={{
            background: 'var(--cream)', border: '2px solid var(--cream-dark)', borderRadius: '12px',
            width: 36, height: 36, cursor: 'pointer', fontWeight: 800,
            color: 'var(--text-light)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>‹</button>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: 'var(--text)' }}>
              {MESES[mes]} {year}
            </h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>
              {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'} este mes
            </p>
          </div>

          <button onClick={() => navMes(1)} style={{
            background: 'var(--cream)', border: '2px solid var(--cream-dark)', borderRadius: '12px',
            width: 36, height: 36, cursor: 'pointer', fontWeight: 800,
            color: 'var(--text-light)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>›</button>
        </div>

        {/* Grid calendario */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px',
          border: '2px solid var(--lila-light)', boxShadow: '4px 4px 0px var(--lila-light)'
        }}>
          {/* Días de la semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {DIAS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontFamily: "'Nunito', sans-serif",
                fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-light)', padding: '4px 0'
              }}>{d}</div>
            ))}
          </div>

          {/* Celdas */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
  {Array.from({ length: diasPrevMonth }).map((_, i) => (
    <div key={`prev-${i}`} style={{
      minHeight: '80px', borderRadius: '12px', padding: '6px',
      background: 'transparent', opacity: 0.3
    }}>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>
        {prevMonthDays - diasPrevMonth + i + 1}
      </span>
    </div>
  ))}

  {Array.from({ length: totalDias }).map((_, i) => {
    const dia = i + 1
    const esHoy = dia === today.getDate() && mes === today.getMonth() && year === today.getFullYear()
    const esSel = diaSeleccionado === dia
    const evs = eventosDelDia(dia)
    const tieneEventos = evs.length > 0

    return (
      <div
        key={dia}
        onClick={() => setDiaSeleccionado(esSel ? null : dia)}
        style={{
          minHeight: '80px', borderRadius: '12px', padding: '4px 4px 4px 4px',
          cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
          background: esSel ? 'var(--lila)' : esHoy ? 'var(--lila-light)' : 'transparent',
          border: esSel ? '2px solid var(--lila-dark)' : esHoy ? '2px solid var(--lila)' : '2px solid transparent',
          boxShadow: esSel ? '0 2px 0px var(--lila-dark)' : 'none'
        }}
        onMouseEnter={e => { if (!esSel && !esHoy) e.currentTarget.style.background = 'var(--cream)' }}
        onMouseLeave={e => { if (!esSel && !esHoy) e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 800,
          color: esSel ? 'white' : esHoy ? 'var(--lila-dark)' : 'var(--text)',
          display: 'block', marginBottom: '4px', paddingLeft: '4px'
        }}>{dia}</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {evs.slice(0, 3).map(ev => {
            const cfg = TIPO_MAP[ev.tipo] || TIPO_MAP.OTRO
            const fechaInicio = new Date(ev.fecha)
            fechaInicio.setHours(0,0,0,0)
            const fechaFin = ev.fechaFin ? new Date(ev.fechaFin) : new Date(fechaInicio)
            fechaFin.setHours(0,0,0,0)
            const diaActual = new Date(year, mes, dia)

            const esInicio = diaActual.getTime() === fechaInicio.getTime()
            const esFin = diaActual.getTime() === fechaFin.getTime()
            const esRango = ev.fechaFin !== null && ev.fechaFin !== undefined

            // Calcular si es domingo (corte de semana) o sábado
            const diaSemana = diaActual.getDay() // 0=Dom, 6=Sab
            const esPrimerDiaSemana = diaSemana === 0
            const esUltimoDiaSemana = diaSemana === 6
            const esUltimoDiaMes = dia === totalDias

            const mostrarTitulo = esInicio || esPrimerDiaSemana

            return (
              <div
                key={ev.id}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  background: cfg.bg,
                  color: cfg.color,
                  padding: '2px 6px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  borderTop: `2px solid ${cfg.dot}`,
                  borderBottom: `2px solid ${cfg.dot}`,
                  borderLeft: (esInicio || esPrimerDiaSemana || !esRango) ? `2px solid ${cfg.dot}` : 'none',
                  borderRight: (esFin || esUltimoDiaSemana || esUltimoDiaMes || !esRango) ? `2px solid ${cfg.dot}` : 'none',
                  borderRadius: (() => {
                    if (!esRango) return '6px'
                    const izq = esInicio || esPrimerDiaSemana
                    const der = esFin || esUltimoDiaSemana || esUltimoDiaMes
                    if (izq && der) return '6px'
                    if (izq) return '6px 0 0 6px'
                    if (der) return '0 6px 6px 0'
                    return '0'
                  })(),
                  marginLeft: (esRango && !esInicio && !esPrimerDiaSemana) ? '-4px' : '0',
                  marginRight: (esRango && !esFin && !esUltimoDiaSemana && !esUltimoDiaMes) ? '-4px' : '0',
                }}
              >
                {mostrarTitulo ? ev.titulo : '\u00A0'}
              </div>
            )
          })}
          {evs.length > 3 && (
            <span style={{ fontSize: '0.6rem', color: esSel ? 'rgba(255,255,255,0.8)' : 'var(--text-light)', fontFamily: "'Nunito', sans-serif", fontWeight: 700, paddingLeft: '4px' }}>
              +{evs.length - 3}
            </span>
          )}
        </div>
      </div>
    )
  })}
</div>

        {/* Eventos del día seleccionado */}
        {diaSeleccionado && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: '20px',
            border: '2px solid var(--lila-light)', boxShadow: '4px 4px 0px var(--lila-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 16, background: 'var(--lila)', borderRadius: 2 }}/>
                {diaSeleccionado} de {MESES[mes]}
              </h3>
              <button onClick={() => openCreate(diaSeleccionado)} style={{
                background: 'var(--lila)', border: '2px solid var(--lila-dark)', borderRadius: '10px',
                padding: '5px 12px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                fontWeight: 700, fontSize: '0.78rem', color: 'white', boxShadow: '0 2px 0px var(--lila-dark)'
              }}>+ Agregar</button>
            </div>
            {diasSeleccionados.length === 0 ? (
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', padding: '12px' }}>
                Sin eventos este día
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diasSeleccionados.map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    padding: '10px 12px', borderRadius: '12px',
                    background: 'var(--cream)', border: '2px solid var(--lila-light)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif", marginBottom: 4 }}>
                        {ev.titulo}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <EventTypeBadge tipo={ev.tipo}/>
                        {ev.fechaFin && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                            hasta {new Date(ev.fechaFin).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                        {ev.descripcion && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                            {ev.descripcion}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setConfirmDelete(ev)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-light)', fontSize: '1rem', flexShrink: 0
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px',
          border: '2px solid var(--lila-light)', boxShadow: '4px 4px 0px var(--lila-light)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{
              fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem', color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <div style={{ width: 4, height: 16, background: 'var(--lila)', borderRadius: 2 }}/>
              Este mes
            </h2>
            <button onClick={() => openCreate()} style={{
              background: 'var(--lila)', border: '2px solid var(--lila-dark)', borderRadius: '12px',
              padding: '6px 12px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
              fontWeight: 700, fontSize: '0.78rem', color: 'white', boxShadow: '0 2px 0px var(--lila-dark)'
            }}>+ Nuevo</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Sparkle size={24} color="var(--lila)" style={{ margin: '0 auto' }}/>
            </div>
          ) : eventosOrdenados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
              <Star size={28} color="var(--lila-light)" style={{ margin: '0 auto 8px' }}/>
              <p style={{ fontSize: '0.85rem', marginBottom: 8 }}>Sin eventos este mes</p>
              <button onClick={() => openCreate()} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--lila-dark)', fontWeight: 700, fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem'
              }}>Agregar evento</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {eventosOrdenados.map(evento => {
                const fecha = new Date(evento.fecha)
                const esHoy = fecha.toDateString() === today.toDateString()
                return (
                  <div key={evento.id} style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    padding: '10px 12px', borderRadius: '12px',
                    background: esHoy ? 'var(--lila-light)' : 'var(--cream)',
                    border: `2px solid ${esHoy ? 'var(--lila)' : 'var(--lila-light)'}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setDiaSeleccionado(fecha.getUTCDate())}
                  >
                    <div style={{
                      width: '38px', flexShrink: 0, textAlign: 'center',
                      background: 'var(--lila)', borderRadius: '10px', padding: '4px',
                      boxShadow: '0 2px 0px var(--lila-dark)'
                    }}>
                      <p style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                        {fecha.toLocaleDateString('es', { month: 'short', timeZone: 'UTC' }).toUpperCase()}
                      </p>
                      <p style={{ color: 'white', fontSize: '1rem', fontWeight: 800, fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>
                        {fecha.getUTCDate()}
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif", marginBottom: 3 }}>
                        {evento.titulo}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <EventTypeBadge tipo={evento.tipo}/>
                        {evento.fechaFin && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                            hasta {new Date(evento.fechaFin).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(evento) }} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-light)', fontSize: '0.9rem', flexShrink: 0
                    }}>×</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Leyenda */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '16px 20px',
          border: '2px solid var(--cream-dark)'
        }}>
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '0.9rem', color: 'var(--text)', marginBottom: '10px' }}>Tipos de evento</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(TIPO_MAP).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: val.dot, flexShrink: 0 }}/>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)' }}>{val.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal crear evento */}
      {showModal && (
        <Modal title="Nuevo evento" onClose={() => setShowModal(false)}>
          <Input label="Título *" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Ej: Examen de Cálculo"/>
          <Input label="Fecha *" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} type="date"/>

          {/* Toggle rango */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div
                onClick={() => setForm(p => ({ ...p, esRango: !p.esRango, fechaFin: '' }))}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px', position: 'relative',
                  background: form.esRango ? 'var(--lila)' : 'var(--cream-dark)',
                  border: `2px solid ${form.esRango ? 'var(--lila-dark)' : 'var(--cream-dark)'}`,
                  transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0
                }}
              >
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '2px',
                  left: form.esRango ? '20px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}/>
              </div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
                Marcar rango de fechas
              </span>
            </label>
          </div>

          {form.esRango && (
            <Input
              label="Fecha de fin *"
              value={form.fechaFin}
              onChange={e => setForm(p => ({ ...p, fechaFin: e.target.value }))}
              type="date"
              min={form.fecha}
            />
          )}

          <Select
            label="Tipo"
            value={form.tipo}
            onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
            options={[
              { value: 'EXAMEN', label: 'Examen' },
              { value: 'ENTREGA', label: 'Entrega' },
              { value: 'CLASE', label: 'Clase' },
              { value: 'OTRO', label: 'Otro' }
            ]}
          />
          <Input label="Descripción (opcional)" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Detalles del evento..." as="textarea"/>
          <button onClick={guardar} disabled={saving} style={{
            width: '100%', padding: '12px', background: 'var(--lila)',
            border: '2px solid var(--lila-dark)', borderRadius: '14px',
            fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'white',
            cursor: 'pointer', boxShadow: '0 3px 0px var(--lila-dark)', opacity: saving ? 0.7 : 1
          }}>{saving ? 'Guardando...' : 'Crear evento'}</button>
        </Modal>
      )}

      {/* Confirmar eliminación */}
      {confirmDelete && (
        <Modal title="¿Eliminar evento?" onClose={() => setConfirmDelete(null)}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '20px' }}>
            ¿Eliminar <strong>{confirmDelete.titulo}</strong>?
            {confirmDelete.fechaFin && (
              <span> (rango: {new Date(confirmDelete.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })} — {new Date(confirmDelete.fechaFin).toLocaleDateString('es', { day: 'numeric', month: 'short' })})</span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setConfirmDelete(null)} style={{
              flex: 1, padding: '10px', background: 'var(--cream)',
              border: '2px solid var(--cream-dark)', borderRadius: '12px',
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, cursor: 'pointer', color: 'var(--text-light)'
            }}>Cancelar</button>
            <button onClick={() => eliminar(confirmDelete.id)} style={{
              flex: 1, padding: '10px', background: '#FFE8F1',
              border: '2px solid var(--pink)', borderRadius: '12px',
              fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--pink-dark)',
              cursor: 'pointer', boxShadow: '0 2px 0px var(--pink)'
            }}>Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
