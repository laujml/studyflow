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
function DifficultyBadge({ dificultad }) {
  const map = {
    FACIL: { label: 'Fácil', tone: 'sage' },
    MEDIA: { label: 'Media', tone: 'lila' },
    DIFICIL: { label: 'Difícil', tone: 'pink' }
  }
  const s = map[dificultad] || map.MEDIA
  return <span className={`metadata-chip metadata-chip--${s.tone}`}>{s.label}</span>
}

function MetaChip({ children, tone = 'sage' }) {
  return <span className={`metadata-chip metadata-chip--${tone}`}>{children}</span>
}

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--theme-overlay)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--dark-surface)', borderRadius: '24px', padding: '28px',
        width: '100%', maxWidth: '440px',
        border: '2px solid var(--pink-light)', boxShadow: '6px 6px 0px var(--pink-light)',
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

/* ── Input ── */
function Input({ label, value, onChange, placeholder, type = 'text', children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '5px' }}>{label}</label>
      {children || (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
          width: '100%', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem',
          border: '2px solid var(--cream-dark)', background: 'var(--cream)',
          fontFamily: "'Nunito', sans-serif", color: 'var(--text)', outline: 'none', boxSizing: 'border-box'
        }}/>
      )}
    </div>
  )
}

/* ── Select ── */
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

/* ── Filter pill ── */
function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
      fontFamily: "'Nunito', sans-serif", cursor: 'pointer', transition: 'all 0.15s',
      background: active ? 'var(--pink-surface-raised-dark)' : 'var(--dark-surface-raised)',
      color: 'var(--dark-text)',
      border: active ? '2px solid var(--pink-border-dark)' : '2px solid var(--dark-border)',
      boxShadow: active ? '0 2px 0px var(--pink-border-dark)' : 'none'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = active
        ? '0 3px 0px var(--pink-border-dark)'
        : '0 2px 0px var(--dark-border)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = active ? '0 2px 0px var(--pink-border-dark)' : 'none'
    }}>{children}</button>
  )
}

const EMPTY_FORM = { nombre: '', fechaLimite: '', dificultad: 'MEDIA', tiempoEstimado: '', cursoId: '' }

export default function Tareas() {
  const [tareas, setTareas] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filtro, setFiltro] = useState('TODAS') // TODAS | PENDIENTES | COMPLETADAS
  const [filtroDif, setFiltroDif] = useState('TODAS')

  const load = () => {
    setLoading(true)
    setLoadError('')
    Promise.all([
      api.get('/tareas'),
      api.get('/cursos')
    ]).then(([t, c]) => {
      setTareas(t.data)
      setCursos(c.data)
    }).catch(error => {
      const message = getErrorMessage(error, 'No se pudieron cargar las tareas')
      setLoadError(message)
      notify(message, 'error')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditando(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (tarea, e) => {
    e.stopPropagation()
    setEditando(tarea)
    const fecha = tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString().split('T')[0] : ''
    setForm({
      nombre: tarea.nombre,
      fechaLimite: fecha,
      dificultad: tarea.dificultad,
      tiempoEstimado: tarea.tiempoEstimado,
      cursoId: tarea.cursoId || ''
    })
    setShowModal(true)
  }

  const guardar = async () => {
    if (!form.nombre.trim() || !form.fechaLimite) return
    setSaving(true)
    const body = {
      nombre: form.nombre,
      fechaLimite: form.fechaLimite,
      dificultad: form.dificultad,
      tiempoEstimado: parseFloat(form.tiempoEstimado) || 1,
      cursoId: form.cursoId || null
    }
    try {
      if (editando) {
        await api.put(`/tareas/${editando.id}`, body)
      } else {
        await api.post('/tareas', body)
      }
      notify(editando ? 'Tarea actualizada' : 'Tarea creada')
      setShowModal(false)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo guardar la tarea'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const completar = async (id, e) => {
    e.stopPropagation()
    try {
      await api.patch(`/tareas/${id}/completar`)
      notify('Tarea completada')
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo completar la tarea'), 'error')
    }
  }

  const eliminar = async (id) => {
    try {
      await api.delete(`/tareas/${id}`)
      notify('Tarea eliminada')
      setConfirmDelete(null)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo eliminar la tarea'), 'error')
    }
  }

  const tareasFiltradas = tareas.filter(t => {
    const estadoOk = filtro === 'TODAS' || (filtro === 'COMPLETADAS' ? t.completada : !t.completada)
    const difOk = filtroDif === 'TODAS' || t.dificultad === filtroDif
    return estadoOk && difOk
  })

  const pendientes = tareas.filter(t => !t.completada).length
  const completadas = tareas.filter(t => t.completada).length

  const diasRestantes = (fecha) => {
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { texto: 'Vencida', color: 'var(--pink-ink)' }
    if (diff === 0) return { texto: 'Hoy', color: 'var(--pink-ink)' }
    if (diff === 1) return { texto: 'Mañana', color: '#A9601B' }
    return { texto: `${diff} días`, color: 'var(--text-light)' }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Sparkle size={32} color="var(--pink)" style={{ margin: '0 auto 12px' }}/>
        <p style={{ color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>Cargando tareas...</p>
      </div>
    </div>
  )

  if (loadError) return (
    <div style={{
      background: 'var(--pink-surface)', borderRadius: '20px', padding: '24px',
      border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)',
      color: 'var(--pink-dark)', fontFamily: "'Nunito', sans-serif", fontWeight: 800
    }}>
      {loadError}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        [data-theme='light'] .task-card {
          background: var(--pink-surface) !important;
          border-color: var(--pink-light) !important;
        }

        [data-theme='light'] .task-card:not(.task-card--completed) {
          box-shadow: 3px 3px 0 var(--pink-light) !important;
        }
      `}</style>
      {/* Header */}
      <div style={{
        background: 'var(--pink-surface)', borderRadius: '20px', padding: '24px 28px',
        border: '2px solid var(--pink-light)', boxShadow: '4px 4px 0px var(--pink-light)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <Star size={18} color="var(--decor-star-light)" style={{ position: 'absolute', top: 14, right: 28 }}/>
        <Sparkle size={12} color="var(--decor-sparkle-light)" style={{ position: 'absolute', bottom: 14, right: 52 }}/>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: 'var(--text)' }}>Mis tareas</h1>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: 'var(--pink-dark)', fontWeight: 700 }}>
              {pendientes} pendientes
            </span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: 'var(--mint-ink)', fontWeight: 700 }}>
              {completadas} completadas
            </span>
          </div>
        </div>
        <button onClick={openCreate} style={{
          background: 'var(--pink)', border: '2px solid var(--pink-dark)', borderRadius: '14px',
          padding: '10px 20px', cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
          fontSize: '1rem', color: 'var(--text-strong)', boxShadow: '0 3px 0px var(--pink-dark)'
        }}>+ Nueva tarea</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <FilterPill active={filtro === 'TODAS'} onClick={() => setFiltro('TODAS')}>Todas</FilterPill>
        <FilterPill active={filtro === 'PENDIENTES'} onClick={() => setFiltro('PENDIENTES')}>Pendientes</FilterPill>
        <FilterPill active={filtro === 'COMPLETADAS'} onClick={() => setFiltro('COMPLETADAS')}>Completadas</FilterPill>
        <div style={{ width: 1, background: 'var(--cream-dark)', margin: '0 4px' }}/>
        <FilterPill active={filtroDif === 'TODAS'} onClick={() => setFiltroDif('TODAS')}>Todas las dificultades</FilterPill>
        <FilterPill active={filtroDif === 'FACIL'} onClick={() => setFiltroDif('FACIL')}>Fácil</FilterPill>
        <FilterPill active={filtroDif === 'MEDIA'} onClick={() => setFiltroDif('MEDIA')}>Media</FilterPill>
        <FilterPill active={filtroDif === 'DIFICIL'} onClick={() => setFiltroDif('DIFICIL')}>Difícil</FilterPill>
      </div>

      {/* Lista */}
      {tareasFiltradas.length === 0 ? (
        <div style={{
          background: 'var(--pink-surface)', borderRadius: '20px', padding: '48px',
          border: '2px solid var(--cream-dark)', textAlign: 'center'
        }}>
          <Star size={36} color="var(--pink-light)" style={{ margin: '0 auto 12px' }}/>
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem', color: 'var(--text)', marginBottom: 8 }}>
            {filtro === 'COMPLETADAS' ? '¡Aún no completaste ninguna tarea!' : 'No hay tareas aquí'}
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'var(--text-light)' }}>
            {filtro === 'TODAS' ? 'Agrega tu primera tarea para empezar' : 'Prueba cambiando los filtros'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tareasFiltradas.map((tarea, i) => {
            const diasInfo = diasRestantes(tarea.fechaLimite)
            return (
              <div key={tarea.id} className={`task-card${tarea.completada ? ' task-card--completed' : ''}`} style={{
                background: tarea.alerta ? 'var(--pink-inner)' : 'var(--pink-surface)', borderRadius: '16px', padding: '16px 18px',
                border: `2px solid ${tarea.completada ? 'var(--cream-dark)' : tarea.alerta ? 'var(--pink-light)' : 'var(--cream-dark)'}`,
                boxShadow: tarea.completada ? 'none' : '3px 3px 0px var(--cream-dark)',
                display: 'flex', alignItems: 'center', gap: '14px',
                opacity: tarea.completada ? 0.6 : 1,
                transition: 'all 0.2s'
              }}>
                {/* Checkbox */}
                <button onClick={e => !tarea.completada && completar(tarea.id, e)} style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0, cursor: tarea.completada ? 'default' : 'pointer',
                  background: tarea.completada ? 'var(--mint-dark)' : 'var(--dark-surface-raised)',
                  border: `2.5px solid ${tarea.completada ? 'var(--mint-ink)' : 'var(--dark-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {tarea.completada && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)',
                    fontFamily: "'Nunito', sans-serif", marginBottom: 4,
                    textDecoration: tarea.completada ? 'line-through' : 'none'
                  }}>{tarea.nombre}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <DifficultyBadge dificultad={tarea.dificultad}/>
                    <MetaChip tone="sage">{tarea.tiempoEstimado}h</MetaChip>
                    {tarea.curso && (
                      <MetaChip tone="lila">{tarea.curso.nombre}</MetaChip>
                    )}
                    <MetaChip tone="pink">{new Date(tarea.fechaLimite).toLocaleDateString('es')}</MetaChip>
                    <MetaChip tone="pink">{diasInfo.texto === 'Hoy' ? 'Para hoy' : diasInfo.texto}</MetaChip>
                  </div>
                </div>

                {/* Alerta */}
                {tarea.alerta && !tarea.completada && (
                  <span className="metadata-chip metadata-chip--pink" style={{ flexShrink: 0 }}>Prioridad alta</span>
                )}

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!tarea.completada && (
                    <button onClick={e => openEdit(tarea, e)} style={{
                      padding: '5px 10px', background: 'var(--cream)',
                      border: '2px solid var(--cream-dark)', borderRadius: '10px',
                      cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-light)'
                    }}>Editar</button>
                  )}
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(tarea) }} style={{
                    padding: '5px 10px', background: 'var(--pink-inner)',
                    border: '2px solid var(--pink-light)', borderRadius: '10px',
                    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700, fontSize: '0.75rem', color: 'var(--pink-dark)'
                  }}>×</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <Modal title={editando ? 'Editar tarea' : 'Nueva tarea'} onClose={() => setShowModal(false)}>
          <Input label="Nombre de la tarea *" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Parcial de Cálculo"/>
          <Input label="Fecha límite *" value={form.fechaLimite} onChange={e => setForm(p => ({ ...p, fechaLimite: e.target.value }))} type="date"/>
          <Select
            label="Dificultad"
            value={form.dificultad}
            onChange={e => setForm(p => ({ ...p, dificultad: e.target.value }))}
            options={[{ value: 'FACIL', label: 'Fácil' }, { value: 'MEDIA', label: 'Media' }, { value: 'DIFICIL', label: 'Difícil' }]}
          />
          <Input label="Tiempo estimado (horas)" value={form.tiempoEstimado} onChange={e => setForm(p => ({ ...p, tiempoEstimado: e.target.value }))} placeholder="Ej: 2.5" type="number"/>
          <Select
            label="Curso (opcional)"
            value={form.cursoId}
            onChange={e => setForm(p => ({ ...p, cursoId: e.target.value }))}
            options={[{ value: '', label: 'Sin curso' }, ...cursos.map(c => ({ value: c.id, label: c.nombre }))]}
          />
          <button onClick={guardar} disabled={saving} style={{
            width: '100%', padding: '12px', background: 'var(--pink)',
            border: '2px solid var(--pink-dark)', borderRadius: '14px',
            fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--text-strong)',
            cursor: 'pointer', boxShadow: '0 3px 0px var(--pink-dark)', opacity: saving ? 0.7 : 1
          }}>{saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear tarea'}</button>
        </Modal>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <Modal title="¿Eliminar tarea?" onClose={() => setConfirmDelete(null)}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '20px' }}>
            ¿Eliminar <strong>{confirmDelete.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setConfirmDelete(null)} style={{
              flex: 1, padding: '10px', background: 'var(--cream)',
              border: '2px solid var(--cream-dark)', borderRadius: '12px',
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, cursor: 'pointer', color: 'var(--text-light)'
            }}>Cancelar</button>
            <button onClick={() => eliminar(confirmDelete.id)} style={{
              flex: 1, padding: '10px', background: 'var(--pink-inner)',
              border: '2px solid var(--pink)', borderRadius: '12px',
              fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--pink-dark)',
              cursor: 'pointer', boxShadow: '0 2px 0px var(--pink)'
            }}>Sí, eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
