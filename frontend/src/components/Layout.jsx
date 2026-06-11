import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill={active ? 'white' : 'var(--text-light)'} />
    </svg>
  )
}

function CursosIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="20" rx="3" fill={active ? 'white' : 'var(--text-light)'} opacity="0.3"/>
      <rect x="3" y="3" width="4" height="20" rx="2" fill={active ? 'white' : 'var(--text-light)'} opacity="0.6"/>
      <rect x="9" y="8" width="9" height="2" rx="1" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="9" y="13" width="9" height="2" rx="1" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="9" y="18" width="6" height="2" rx="1" fill={active ? 'white' : 'var(--text-light)'}/>
    </svg>
  )
}

function TareasIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill={active ? 'white' : 'var(--text-light)'} opacity="0.3"/>
      <path d="M7 12L10 15L17 8" stroke={active ? 'white' : 'var(--text-light)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CalendarioIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3" fill={active ? 'white' : 'var(--text-light)'} opacity="0.3"/>
      <rect x="3" y="4" width="18" height="6" rx="3" fill={active ? 'white' : 'var(--text-light)'} opacity="0.8"/>
      <rect x="7" y="2" width="2" height="4" rx="1" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="15" y="2" width="2" height="4" rx="1" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="7" y="14" width="2" height="2" rx="0.5" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="11" y="14" width="2" height="2" rx="0.5" fill={active ? 'white' : 'var(--text-light)'}/>
      <rect x="15" y="14" width="2" height="2" rx="0.5" fill={active ? 'white' : 'var(--text-light)'}/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5C4.5 21 3 21 3 19V5C3 3 4.5 3 5 3H9" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 17L21 12L16 7" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round"/>
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
      <circle cx="20" cy="20" r="7" fill="white"/>
      <circle cx="20" cy="20" r="4" fill={color}/>
    </svg>
  )
}

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon, color: 'var(--pink)', shadow: 'var(--pink-dark)', end: true },
  { to: '/cursos', label: 'Cursos', icon: CursosIcon, color: 'var(--lila)', shadow: 'var(--lila-dark)' },
  { to: '/tareas', label: 'Tareas', icon: TareasIcon, color: 'var(--mint-dark)', shadow: '#5bbfb0' },
  { to: '/calendario', label: 'Calendario', icon: CalendarioIcon, color: 'var(--pink-dark)', shadow: '#d9607a' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const handleNotify = (event) => {
      setNotification(event.detail)
      window.clearTimeout(window.studyflowNotificationTimer)
      window.studyflowNotificationTimer = window.setTimeout(() => setNotification(null), 2800)
    }

    window.addEventListener('studyflow:notify', handleNotify)
    return () => window.removeEventListener('studyflow:notify', handleNotify)
  }, [])

  const handleLogout = () => {
    logout()
    sessionStorage.setItem('studyflow:authMessage', 'Sesion cerrada correctamente')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'white',
        borderRight: '2px solid var(--pink-light)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden'
      }}>
        {/* Decoraciones sidebar */}
        <Cloud size={80} color="#FFE8F1" style={{ position: 'absolute', bottom: '15%', right: '-20px', opacity: 0.6 }}/>
        <Flower size={24} color="#E4DCFF" style={{ position: 'absolute', bottom: '28%', left: '12px', opacity: 0.7 }}/>
        <Star size={12} color="#FFB5C8" style={{ position: 'absolute', top: '35%', right: '18px', opacity: 0.5 }}/>

        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'var(--pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 0px var(--pink-dark)'
            }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="26" rx="3" fill="white" opacity="0.9"/>
                <rect x="4" y="4" width="4" height="26" rx="2" fill="white" opacity="0.5"/>
                <rect x="10" y="10" width="12" height="2" rx="1" fill="#FFB5C8"/>
                <rect x="10" y="15" width="12" height="2" rx="1" fill="#C9B8FF"/>
                <rect x="10" y="20" width="8" height="2" rx="1" fill="#B8F0E6"/>
              </svg>
            </div>
            <h1 style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: '1.4rem',
              color: 'var(--text)',
              lineHeight: 1
            }}>StudyFlow</h1>
          </div>
        </div>

        {/* User info */}
        <div style={{
          background: 'var(--cream)',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '24px',
          border: '2px solid var(--pink-light)'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--lila)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px',
            boxShadow: '0 2px 0px var(--lila-dark)'
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', fontFamily: "'Nunito', sans-serif" }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', fontFamily: "'Nunito', sans-serif" }}>
            {user?.nombre}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: "'Nunito', sans-serif" }}>
            {user?.email}
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon, color, shadow, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.9rem',
                fontWeight: isActive ? 800 : 600,
                background: isActive ? color : 'transparent',
                color: isActive ? 'white' : 'var(--text-light)',
                boxShadow: isActive ? `0 3px 0px ${shadow}` : 'none',
                transition: 'all 0.15s',
                border: isActive ? 'none' : '2px solid transparent'
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '12px',
            border: '2px solid var(--cream-dark)',
            background: 'transparent', cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem',
            fontWeight: 600, color: 'var(--text-light)',
            transition: 'all 0.15s', width: '100%'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <LogoutIcon />
          Cerrar sesion
        </button>
      </aside>

      {/* Contenido principal */}
      <main style={{
        marginLeft: '220px',
        flex: 1,
        padding: '32px',
        minHeight: '100vh'
      }}>
        <Outlet />
      </main>

      {notification && (
        <div style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 2000,
          background: notification.type === 'error' ? '#FFE8E8' : 'white',
          border: `2px solid ${notification.type === 'error' ? '#FFB5B5' : 'var(--mint-light)'}`,
          boxShadow: `4px 4px 0px ${notification.type === 'error' ? '#FFB5B5' : '#B8F0E6'}`,
          color: notification.type === 'error' ? '#CC4444' : 'var(--text)',
          borderRadius: '14px', padding: '12px 16px',
          fontFamily: "'Nunito', sans-serif", fontWeight: 800,
          fontSize: '0.85rem', maxWidth: '320px'
        }}>
          {notification.message}
        </div>
      )}
    </div>
  )
}
