import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { getErrorMessage, notify } from '../utils/notifications'

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
        border: '2px solid var(--mint-light)', boxShadow: '6px 6px 0px var(--mint-light)',
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

function FilePreviewModal({ archivo, onClose }) {
  const tipo = archivo?.tipo || ''
  const isImage = tipo.includes('image')
  const isPdf = tipo.includes('pdf')
  const isOffice = tipo.includes('word') || tipo.includes('document') || tipo.includes('sheet') || tipo.includes('excel') || tipo.includes('presentation') || tipo.includes('powerpoint')
  const readableUrl = getReadableFileUrl(archivo)
  const previewUrl = isOffice
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(readableUrl)}`
    : readableUrl

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--theme-overlay)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--dark-surface)', borderRadius: '20px', padding: '18px',
        width: 'min(980px, 96vw)', height: 'min(760px, 92vh)',
        border: '2px solid var(--mint-light)', boxShadow: '6px 6px 0px var(--mint-shadow)',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Fredoka One', cursive", fontSize: '1rem',
              color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{archivo.nombre}</h2>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>
              {tipoIcono(tipo)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <a href={readableUrl} target="_blank" rel="noreferrer" style={{
              background: 'var(--cream)', border: '2px solid var(--cream-dark)', borderRadius: '12px',
              padding: '6px 12px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
              fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-light)', textDecoration: 'none'
            }}>Abrir externo</a>
            <button onClick={onClose} style={{
              background: 'var(--cream)', border: '2px solid var(--cream-dark)', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', fontWeight: 800,
              color: 'var(--text-light)', fontSize: '1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>×</button>
          </div>
        </div>

        <div style={{
          flex: 1, minHeight: 0, borderRadius: '14px', overflow: 'hidden',
          border: '2px solid var(--cream-dark)', background: 'var(--cream)'
        }}>
          {isImage ? (
            <img src={readableUrl} alt={archivo.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
          ) : (isPdf || isOffice) ? (
            <iframe
              src={previewUrl}
              title={archivo.nombre}
              style={{ width: '100%', height: '100%', border: 'none', background: 'var(--dark-surface)' }}
            />
          ) : (
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '10px', padding: '24px', textAlign: 'center'
            }}>
              <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.4rem', color: 'var(--text)' }}>{tipoIcono(tipo)}</span>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 700 }}>
                Este tipo de archivo no tiene vista previa integrada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getReadableFileUrl(archivo) {
  if (!archivo?.url || !archivo?.nombre) return archivo?.url || ''

  const extension = archivo.nombre.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase()
  if (!extension) return archivo.url

  try {
    const parsed = new URL(archivo.url)
    const lastSegment = parsed.pathname.split('/').pop() || ''
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(lastSegment)

    if (!hasExtension) {
      parsed.pathname = `${parsed.pathname}${extension}`
    }

    return parsed.toString()
  } catch {
    return archivo.url
  }
}

function Input({ label, value, onChange, placeholder, type = 'text', hint }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '5px' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem',
        border: '2px solid var(--cream-dark)', background: 'var(--cream)',
        fontFamily: "'Nunito', sans-serif", color: 'var(--text)', outline: 'none', boxSizing: 'border-box'
      }}/>
      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

function SectionTitle({ children, color = 'var(--mint-dark)' }) {
  return (
    <h3 style={{
      fontFamily: "'Fredoka One', cursive", fontSize: '1rem',
      color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px'
    }}>
      <div style={{ width: 4, height: 16, background: color, borderRadius: 2 }}/>
      {children}
    </h3>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
      fontFamily: "'Nunito', sans-serif", cursor: 'pointer',
      background: active ? 'var(--sage-accent-dark)' : 'var(--sage-surface-raised-dark)',
      color: active ? 'var(--dark-text)' : 'var(--dark-muted)',
      border: active ? '2px solid var(--sage-border-dark)' : '2px solid var(--sage-border-dark)',
      boxShadow: active ? '0 2px 0px var(--sage-border-dark)' : 'none'
    }}>{children}</button>
  )
}

const CARD_COLORS = ['var(--sage-accent-dark)', 'var(--sage-accent-dark)', 'var(--sage-accent-dark)', 'var(--sage-accent-dark)']
const CARD_SHADOWS = ['var(--sage-border-dark)', 'var(--sage-border-dark)', 'var(--sage-border-dark)', 'var(--sage-border-dark)']
const CARD_INKS = ['var(--dark-text)', 'var(--dark-text)', 'var(--dark-text)', 'var(--dark-text)']

const tipoIcono = (tipo) => {
  if (!tipo) return 'FILE'
  if (tipo.includes('pdf')) return 'PDF'
  if (tipo.includes('image')) return 'IMG'
  if (tipo.includes('word') || tipo.includes('document')) return 'DOC'
  if (tipo.includes('sheet') || tipo.includes('excel')) return 'XLS'
  if (tipo.includes('presentation') || tipo.includes('powerpoint')) return 'PPT'
  return 'FILE'
}
const tipoColor = (tipo) => {
  if (!tipo) return { bg: 'var(--dark-surface-raised)', color: 'var(--dark-muted)' }
  if (tipo.includes('pdf')) return { bg: 'var(--pink-inner)', color: 'var(--pink-ink)' }
  if (tipo.includes('image')) return { bg: 'var(--lila-inner)', color: 'var(--lila-ink)' }
  if (tipo.includes('word') || tipo.includes('document')) return { bg: 'var(--mint-light)', color: 'var(--mint-ink)' }
  if (tipo.includes('sheet') || tipo.includes('excel')) return { bg: 'var(--mint-inner)', color: 'var(--mint-ink)' }
  if (tipo.includes('presentation') || tipo.includes('powerpoint')) return { bg: 'var(--dark-surface-raised)', color: 'var(--dark-muted)' }
  return { bg: 'var(--cream)', color: 'var(--text-light)' }
}
const tipoCategoria = (tipo) => {
  if (!tipo) return 'otro'
  if (tipo.includes('image')) return 'imagen'
  if (tipo.includes('pdf')) return 'pdf'
  if (tipo.includes('word') || tipo.includes('document') || tipo.includes('sheet') || tipo.includes('excel') || tipo.includes('presentation') || tipo.includes('powerpoint')) return 'documento'
  return 'otro'
}

/* ═══════════════════════════════════════════════════
   CURSO DETAIL
═══════════════════════════════════════════════════ */
function CursoDetail({ curso, onBack }) {
  const [data, setData] = useState(null)
  const [calificaciones, setCalificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [archivoPreview, setArchivoPreview] = useState(null)
  const [filtroArchivo, setFiltroArchivo] = useState('todo')
  const [busqueda, setBusqueda] = useState('')
  const [showCalModal, setShowCalModal] = useState(false)
  const [calForm, setCalForm] = useState({ nombre: '', nota: '', notaMaxima: '10', porcentaje: '' })
  const [calEditando, setCalEditando] = useState(null)
  const [savingCal, setSavingCal] = useState(false)
  const [notaProyeccion, setNotaProyeccion] = useState('')
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    setLoadError('')
    Promise.all([
      api.get(`/cursos/${curso.id}`),
      api.get(`/cursos/${curso.id}/calificaciones`)
    ]).then(([c, cal]) => {
      setData(c.data)
      setCalificaciones(cal.data)
    }).catch(error => {
      const message = getErrorMessage(error, 'No se pudo cargar el curso')
      setLoadError(message)
      notify(message, 'error')
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [curso.id])

  const porcentajeUsado = calificaciones.reduce((s, c) => s + c.porcentaje, 0)
  const porcentajeUsadoSinEdicion = calEditando
    ? porcentajeUsado - calEditando.porcentaje
    : porcentajeUsado
  const acumulado = calificaciones.reduce((s, c) => {
    const normalizada = (c.nota / c.notaMaxima) * 10
    return s + (normalizada * c.porcentaje / 100)
  }, 0)
  const porcentajeFaltante = Math.max(0, 100 - porcentajeUsado)
  const proyeccionFinal = notaProyeccion !== ''
    ? acumulado + (parseFloat(notaProyeccion) * porcentajeFaltante / 100)
    : null
  const notaParaAprobar = porcentajeFaltante > 0
    ? ((6 - acumulado) / (porcentajeFaltante / 100))
    : null

  const notaColor = (val) => {
    if (val >= 8) return 'var(--mint-ink)'
    if (val >= 6) return 'var(--lila-ink)'
    return 'var(--pink-ink)'
  }

  const openCreateCalificacion = () => {
    setCalEditando(null)
    setCalForm({ nombre: '', nota: '', notaMaxima: '10', porcentaje: '' })
    setShowCalModal(true)
  }

  const openEditCalificacion = (cal) => {
    setCalEditando(cal)
    setCalForm({
      nombre: cal.nombre,
      nota: String(cal.nota),
      notaMaxima: String(cal.notaMaxima),
      porcentaje: String(cal.porcentaje)
    })
    setShowCalModal(true)
  }

  const guardarCalificacion = async () => {
    if (!calForm.nombre.trim() || !calForm.nota || !calForm.notaMaxima || !calForm.porcentaje) return
    setSavingCal(true)
    try {
      if (calEditando) {
        await api.put(`/cursos/${curso.id}/calificaciones/${calEditando.id}`, calForm)
      } else {
        await api.post(`/cursos/${curso.id}/calificaciones`, calForm)
      }
      setShowCalModal(false)
      setCalEditando(null)
      setCalForm({ nombre: '', nota: '', notaMaxima: '10', porcentaje: '' })
      load()
      notify(calEditando ? 'Calificacion actualizada' : 'Calificacion agregada')
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo guardar la calificacion'), 'error')
    } finally {
      setSavingCal(false)
    }
  }

  const eliminarCalificacion = async (id) => {
    try {
      await api.delete(`/cursos/${curso.id}/calificaciones/${id}`)
      notify('Calificacion eliminada')
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo eliminar la calificacion'), 'error')
    }
  }

  const subirArchivo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('archivo', file)
    try {
      await api.post(`/cursos/${curso.id}/archivos`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      load()
      notify('Archivo subido correctamente')
    } catch (error) {
      setUploadError(error.response?.data?.detalle || error.response?.data?.error || 'No se pudo subir el archivo')
      notify(getErrorMessage(error, 'No se pudo subir el archivo'), 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const eliminarArchivo = async (archivoId) => {
    try {
      await api.delete(`/cursos/${curso.id}/archivos/${archivoId}`)
      notify('Archivo eliminado')
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo eliminar el archivo'), 'error')
    }
  }

  const archivosFiltrados = (data?.archivos || []).filter(a => {
    const catOk = filtroArchivo === 'todo' || tipoCategoria(a.tipo) === filtroArchivo
    const busOk = !busqueda || a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return catOk && busOk
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Sparkle size={32} color="var(--theme-mint)" style={{ margin: '0 auto' }}/>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'var(--mint-surface)', borderRadius: '20px', padding: '24px 28px',
        border: '2px solid var(--mint-light)', boxShadow: '6px 6px 0px var(--mint-shadow), -2px -2px 0px rgba(255,255,255,0.5)',
        position: 'relative', overflow: 'hidden'
      }}>
        <Star size={18} color="var(--decor-star-light)" style={{ position: 'absolute', top: 16, right: 24 }}/>
        <Sparkle size={12} color="var(--decor-sparkle-light)" style={{ position: 'absolute', bottom: 14, right: 44 }}/>
        <button onClick={onBack} style={{
          background: 'var(--cream)', border: '2px solid var(--cream-dark)', borderRadius: '12px',
          padding: '6px 14px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
          fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '14px'
        }}>← Volver</button>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '16px', background: 'var(--theme-mint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 3px 0px var(--theme-mint-shadow)'
          }}>
            <span style={{ color: 'var(--text-strong)', fontFamily: "'Fredoka One', cursive", fontSize: '1.5rem' }}>
              {data?.nombre.charAt(0)}
            </span>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: 'var(--text)' }}>{data?.nombre}</h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
              {data?.docente}{data?.correo && ` · ${data.correo}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── CALIFICACIONES ── */}
      <div style={{
        background: 'var(--mint-surface)', borderRadius: '20px', padding: '20px',
        border: '2px solid var(--mint-light)', boxShadow: '4px 4px 0px var(--mint-light)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SectionTitle color="var(--mint-dark)">Calificaciones</SectionTitle>
          <button onClick={openCreateCalificacion} style={{
            background: 'var(--theme-mint)', border: '2px solid var(--theme-mint-border)', borderRadius: '12px',
            padding: '5px 14px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-strong)', boxShadow: '0 2px 0px var(--theme-mint-shadow)'
          }}>+ Agregar</button>
        </div>

        {calificaciones.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', padding: '16px' }}>
            Aún no hay calificaciones registradas
          </p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {['Evaluación', 'Nota', 'Sobre 10', '% del curso', 'Aporte', ''].map(h => (
                      <th key={h} style={{
                        fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', fontWeight: 800,
                        color: 'var(--text-light)', textAlign: 'left', padding: '4px 10px'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calificaciones.map(cal => {
                    const normalizada = (cal.nota / cal.notaMaxima) * 10
                    const aporte = normalizada * cal.porcentaje / 100
                    return (
                      <tr key={cal.id}>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', borderRadius: '12px 0 0 12px', border: '2px solid var(--mint-light)', borderRight: 'none' }}>
                          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{cal.nombre}</span>
                        </td>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', border: '2px solid var(--mint-light)', borderLeft: 'none', borderRight: 'none' }}>
                          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: notaColor(normalizada) }}>
                            {cal.nota}/{cal.notaMaxima}
                          </span>
                        </td>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', border: '2px solid var(--mint-light)', borderLeft: 'none', borderRight: 'none' }}>
                          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: 'var(--text-light)' }}>
                            {normalizada.toFixed(1)}
                          </span>
                        </td>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', border: '2px solid var(--mint-light)', borderLeft: 'none', borderRight: 'none' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                            background: 'var(--mint-light)', color: 'var(--theme-mint-ink)', fontFamily: "'Nunito', sans-serif"
                          }}>{cal.porcentaje}%</span>
                        </td>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', border: '2px solid var(--mint-light)', borderLeft: 'none', borderRight: 'none' }}>
                          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: notaColor(normalizada) }}>
                            +{aporte.toFixed(2)}
                          </span>
                        </td>
                        <td style={{ padding: '10px', background: 'var(--mint-inner)', borderRadius: '0 12px 12px 0', border: '2px solid var(--mint-light)', borderLeft: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button onClick={() => openEditCalificacion(cal)} style={{
                              background: 'var(--mint-surface)', border: '2px solid var(--mint-light)', borderRadius: '10px',
                              cursor: 'pointer', color: 'var(--theme-mint-ink)', fontSize: '0.72rem',
                              fontFamily: "'Nunito', sans-serif", fontWeight: 800, padding: '4px 8px'
                            }}>Editar</button>
                            <button onClick={() => eliminarCalificacion(cal.id)} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--text-light)', fontSize: '1rem'
                            }}>×</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            <div style={{
              marginTop: '16px', padding: '16px', borderRadius: '16px',
               background: 'var(--mint-light)', border: '2px solid var(--theme-mint)',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                 <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', color: 'var(--theme-mint-ink)', fontWeight: 700, marginBottom: 2 }}>
                  Acumulado actual
                </p>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: notaColor(acumulado) }}>
                  {acumulado.toFixed(2)}<span style={{ fontSize: '0.9rem' }}>/10</span>
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'var(--text-light)' }}>
                  {porcentajeUsado.toFixed(0)}% del curso evaluado
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                 <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', color: 'var(--theme-mint-ink)', fontWeight: 700, marginBottom: 2 }}>
                  Para aprobar necesito
                </p>
                {porcentajeFaltante > 0 ? (
                  <>
                    <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.6rem', color: notaColor(notaParaAprobar) }}>
                      {notaParaAprobar <= 0 ? '¡Ya!' : notaParaAprobar > 10 ? 'Imposible' : notaParaAprobar.toFixed(1)}
                      {notaParaAprobar > 0 && notaParaAprobar <= 10 && <span style={{ fontSize: '0.9rem' }}>/10</span>}
                    </p>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'var(--text-light)' }}>
                      en el {porcentajeFaltante.toFixed(0)}% restante
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--mint-ink)', marginTop: 6 }}>Curso completo</p>
                )}
              </div>


            </div>
          </>
        )}
      </div>

      {/* ── ARCHIVOS ── */}
      <div style={{
        background: 'var(--mint-surface)', borderRadius: '20px', padding: '20px',
        border: '2px solid var(--mint-light)', boxShadow: '4px 4px 0px var(--mint-shadow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <SectionTitle color="var(--mint-dark)">Archivos</SectionTitle>
          <button onClick={() => fileRef.current.click()} style={{
            background: 'var(--theme-mint)', border: '2px solid var(--theme-mint-border)', borderRadius: '12px',
            padding: '5px 14px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-strong)', boxShadow: '0 2px 0px var(--theme-mint-shadow)'
          }} disabled={uploading}>{uploading ? 'Subiendo...' : '+ Subir'}</button>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={subirArchivo}/>
        </div>

        {uploadError && (
          <p style={{
            marginBottom: '12px', padding: '8px 12px', borderRadius: '12px',
            background: 'var(--mint-inner)', border: '2px solid var(--mint-light)',
            color: 'var(--theme-mint-ink)', fontFamily: "'Nunito', sans-serif",
            fontSize: '0.8rem', fontWeight: 700
          }}>
            {uploadError}
          </p>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterPill active={filtroArchivo === 'todo'} onClick={() => setFiltroArchivo('todo')}>Todo</FilterPill>
          <FilterPill active={filtroArchivo === 'imagen'} onClick={() => setFiltroArchivo('imagen')}>Imágenes</FilterPill>
          <FilterPill active={filtroArchivo === 'pdf'} onClick={() => setFiltroArchivo('pdf')}>PDFs</FilterPill>
          <FilterPill active={filtroArchivo === 'documento'} onClick={() => setFiltroArchivo('documento')}>Documentos</FilterPill>
          <FilterPill active={filtroArchivo === 'otro'} onClick={() => setFiltroArchivo('otro')}>Otros</FilterPill>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <input
              value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{
                width: '100%', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem',
                border: '2px solid var(--cream-dark)', background: 'var(--cream)',
                fontFamily: "'Nunito', sans-serif", color: 'var(--text)', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {archivosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', padding: '16px' }}>
            {busqueda || filtroArchivo !== 'todo' ? 'No hay archivos con ese filtro' : 'Sin archivos aún'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {archivosFiltrados.map(archivo => {
              const tc = tipoColor(archivo.tipo)
              const ic = tipoIcono(archivo.tipo)
              return (
                <div key={archivo.id} style={{
                  borderRadius: '14px', overflow: 'hidden',
                  border: '2px solid var(--mint-light)', background: 'var(--cream)'
                }}>
                  {archivo.tipo?.includes('image') ? (
                    <button onClick={() => setArchivoPreview(archivo)} style={{
                      display: 'block', width: '100%', padding: 0, border: 'none',
                      background: 'transparent', cursor: 'pointer'
                    }}>
                      <div style={{ height: '100px', overflow: 'hidden' }}>
                        <img src={archivo.url} alt={archivo.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      </div>
                    </button>
                  ) : (
                    <button onClick={() => setArchivoPreview(archivo)} style={{
                      display: 'block', width: '100%', padding: 0, border: 'none',
                      background: 'transparent', cursor: 'pointer'
                    }}>
                      <div style={{
                        height: '80px', background: tc.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.1rem', color: tc.color }}>{ic}</span>
                      </div>
                    </button>
                  )}
                  <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontWeight: 700, fontSize: '0.78rem', color: 'var(--text)',
                        fontFamily: "'Nunito', sans-serif",
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px'
                      }}>{archivo.nombre}</p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
                        {new Date(archivo.createdAt).toLocaleDateString('es')}
                      </p>
                    </div>
                    <button onClick={() => eliminarArchivo(archivo.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-light)', fontSize: '1rem', flexShrink: 0
                    }}>×</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal nueva calificación */}
      {showCalModal && (
        <Modal title={calEditando ? 'Editar calificación' : 'Nueva calificación'} onClose={() => {
          setShowCalModal(false)
          setCalEditando(null)
        }}>
          <Input
            label="Nombre de la evaluación *"
            value={calForm.nombre}
            onChange={e => setCalForm(p => ({ ...p, nombre: e.target.value }))}
            placeholder="Ej: Parcial 1, Tarea 3, Proyecto final"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Nota obtenida *"
              value={calForm.nota}
              onChange={e => setCalForm(p => ({ ...p, nota: e.target.value }))}
              placeholder="Ej: 8.5"
              type="number"
            />
            <Input
              label="Nota máxima *"
              value={calForm.notaMaxima}
              onChange={e => setCalForm(p => ({ ...p, notaMaxima: e.target.value }))}
              placeholder="Ej: 10"
              type="number"
            />
          </div>
          <Input
            label="Porcentaje del curso *"
            value={calForm.porcentaje}
            onChange={e => setCalForm(p => ({ ...p, porcentaje: e.target.value }))}
            placeholder="Ej: 30"
            type="number"
            hint={`Porcentaje ya usado: ${porcentajeUsadoSinEdicion.toFixed(0)}% · Disponible: ${Math.max(0, 100 - porcentajeUsadoSinEdicion).toFixed(0)}%`}
          />
          <button onClick={guardarCalificacion} disabled={savingCal} style={{
            width: '100%', padding: '12px', background: 'var(--theme-mint)',
            border: '2px solid var(--theme-mint-border)', borderRadius: '14px',
            fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--text-strong)',
            cursor: 'pointer', boxShadow: '0 3px 0px var(--theme-mint-shadow)', opacity: savingCal ? 0.7 : 1
          }}>{savingCal ? 'Guardando...' : calEditando ? 'Guardar cambios' : 'Guardar calificación'}</button>
        </Modal>
      )}

      {archivoPreview && (
        <FilePreviewModal archivo={archivoPreview} onClose={() => setArchivoPreview(null)} />
      )}
    </div>
  )

  if (loadError) return (
    <div style={{
      background: 'var(--mint-surface)', borderRadius: '20px', padding: '24px',
      border: '2px solid var(--mint-light)', boxShadow: '4px 4px 0px var(--mint-shadow)',
      color: 'var(--mint-ink)', fontFamily: "'Nunito', sans-serif", fontWeight: 800
    }}>
      {loadError}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN — lista de cursos
═══════════════════════════════════════════════════ */
export default function Cursos() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [detalle, setDetalle] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', docente: '', correo: '' })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = () => {
    setLoading(true)
    setLoadError('')
    api.get('/cursos')
      .then(r => setCursos(r.data))
      .catch(error => {
        const message = getErrorMessage(error, 'No se pudieron cargar los cursos')
        setLoadError(message)
        notify(message, 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditando(null)
    setForm({ nombre: '', docente: '', correo: '' })
    setShowModal(true)
  }

  const openEdit = (curso, e) => {
    e.stopPropagation()
    setEditando(curso)
    setForm({ nombre: curso.nombre, docente: curso.docente, correo: curso.correo })
    setShowModal(true)
  }

  const guardar = async () => {
    if (!form.nombre.trim()) return
    setSaving(true)
    try {
      if (editando) {
        await api.put(`/cursos/${editando.id}`, form)
      } else {
        await api.post('/cursos', form)
      }
      notify(editando ? 'Curso actualizado' : 'Curso creado')
      setShowModal(false)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo guardar el curso'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id) => {
    try {
      await api.delete(`/cursos/${id}`)
      notify('Curso eliminado')
      setConfirmDelete(null)
      load()
    } catch (error) {
      notify(getErrorMessage(error, 'No se pudo eliminar el curso'), 'error')
    }
  }

  if (detalle) return <CursoDetail curso={detalle} onBack={() => { setDetalle(null); load() }}/>

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Sparkle size={32} color="var(--theme-mint)" style={{ margin: '0 auto 12px' }}/>
        <p style={{ color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>Cargando cursos...</p>
      </div>
    </div>
  )

  if (loadError) return (
    <div style={{
      background: 'var(--mint-surface)', borderRadius: '20px', padding: '24px',
      border: '2px solid var(--mint-light)', boxShadow: '4px 4px 0px var(--mint-shadow)',
      color: 'var(--mint-ink)', fontFamily: "'Nunito', sans-serif", fontWeight: 800
    }}>
      {loadError}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        background: 'var(--mint-surface)', borderRadius: '20px', padding: '24px 28px',
        border: '2px solid var(--mint-light)', boxShadow: '6px 6px 0px var(--mint-shadow), -2px -2px 0px rgba(255,255,255,0.5)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <Star size={18} color="var(--decor-star-light)" style={{ position: 'absolute', top: 14, right: 28 }}/>
        <Sparkle size={12} color="var(--decor-sparkle-light)" style={{ position: 'absolute', bottom: 14, right: 52 }}/>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.8rem', color: 'var(--text)' }}>Mis cursos</h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
            {cursos.length} {cursos.length === 1 ? 'curso activo' : 'cursos activos'}
          </p>
        </div>
        <button onClick={openCreate} style={{
          background: 'var(--theme-mint)', border: '2px solid var(--theme-mint-border)', borderRadius: '14px',
          padding: '10px 20px', cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
          fontSize: '1rem', color: 'var(--text-strong)', boxShadow: '0 3px 0px var(--theme-mint-shadow)'
        }}>+ Nuevo curso</button>
      </div>

      {cursos.length === 0 ? (
        <div style={{
          background: 'var(--mint-surface)', borderRadius: '20px', padding: '48px',
          border: '2px solid var(--cream-dark)', textAlign: 'center'
        }}>
          <Star size={36} color="var(--mint-light)" style={{ margin: '0 auto 12px' }}/>
          <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem', color: 'var(--text)', marginBottom: 8 }}>
            Aún no tienes cursos
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 16 }}>
            Agrega tu primer curso para empezar a organizar todo
          </p>
          <button onClick={openCreate} style={{
            background: 'var(--theme-mint)', border: '2px solid var(--theme-mint-border)', borderRadius: '14px',
            padding: '10px 20px', cursor: 'pointer', fontFamily: "'Fredoka One', cursive",
            fontSize: '1rem', color: 'var(--text-strong)', boxShadow: '0 3px 0px var(--theme-mint-shadow)'
          }}>+ Agregar curso</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 360px))', gap: '16px' }}>
          {cursos.map((curso, i) => (
            <div key={curso.id} onClick={() => setDetalle(curso)} style={{
              background: 'var(--sage-surface-raised-dark)', borderRadius: '20px', padding: '20px',
              border: '2px solid var(--sage-border-dark)',
              boxShadow: '6px 6px 0px var(--sage-border-dark)',
              cursor: 'pointer', transition: 'transform 0.15s ease', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', height: '100%'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '14px', flexShrink: 0,
                  background: CARD_COLORS[i % 4],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 3px 0px ${CARD_SHADOWS[i % 4]}`
                }}>
                  <span style={{ color: CARD_INKS[i % 4], fontFamily: "'Fredoka One', cursive", fontSize: '1.2rem' }}>
                    {curso.nombre.charAt(0)}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--dark-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {curso.nombre}
                  </p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: 'var(--dark-muted)', fontWeight: 600 }}>
                    {curso.docente}
                  </p>
                </div>
              </div>
              {curso.correo && (
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: 8 }}>
                  {curso.correo}
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
                <button onClick={e => openEdit(curso, e)} style={{
                  flex: 1, padding: '6px', background: 'var(--sage-surface-raised-dark)',
                  border: '2px solid var(--sage-border-dark)', borderRadius: '10px',
                  cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700, fontSize: '0.75rem', color: 'var(--sage-border-dark)',
                  boxShadow: '0 2px 0px var(--sage-border-dark)', transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--sage-accent-dark)'
                  e.currentTarget.style.boxShadow = '0 3px 0px var(--sage-border-dark)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--sage-surface-raised-dark)'
                  e.currentTarget.style.boxShadow = '0 2px 0px var(--sage-border-dark)'
                }}>Editar</button>
                <button onClick={e => { e.stopPropagation(); setConfirmDelete(curso) }} style={{
                  flex: 1, padding: '6px', background: 'var(--pink-inner)',
                  border: '2px solid var(--pink-light)', borderRadius: '10px',
                  cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700, fontSize: '0.75rem', color: 'var(--pink-dark)'
                }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editando ? 'Editar curso' : 'Nuevo curso'} onClose={() => setShowModal(false)}>
          <Input label="Nombre del curso *" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Cálculo Diferencial"/>
          <Input label="Docente" value={form.docente} onChange={e => setForm(p => ({ ...p, docente: e.target.value }))} placeholder="Nombre del profesor"/>
          <Input label="Correo del docente" value={form.correo} onChange={e => setForm(p => ({ ...p, correo: e.target.value }))} placeholder="profesor@universidad.edu" type="email"/>
          <button onClick={guardar} disabled={saving} style={{
            width: '100%', padding: '12px', background: 'var(--theme-mint)',
            border: '2px solid var(--theme-mint-border)', borderRadius: '14px',
            fontFamily: "'Fredoka One', cursive", fontSize: '1rem', color: 'var(--text-strong)',
            cursor: 'pointer', boxShadow: '0 3px 0px var(--theme-mint-shadow)', opacity: saving ? 0.7 : 1
          }}>{saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear curso'}</button>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="¿Eliminar curso?" onClose={() => setConfirmDelete(null)}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '20px' }}>
            Se eliminará <strong>{confirmDelete.nombre}</strong> junto con todas sus calificaciones y archivos. Esta acción no se puede deshacer.
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
