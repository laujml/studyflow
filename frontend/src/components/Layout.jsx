import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

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
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} />
    </svg>
  )
}

function CursosIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="20" rx="3" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} opacity="0.3"/>
      <rect x="3" y="3" width="4" height="20" rx="2" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} opacity="0.6"/>
      <rect x="9" y="8" width="9" height="2" rx="1" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="9" y="13" width="9" height="2" rx="1" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="9" y="18" width="6" height="2" rx="1" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
    </svg>
  )
}

function TareasIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} opacity="0.3"/>
      <path d="M7 12L10 15L17 8" stroke={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CalendarioIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="3" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} opacity="0.3"/>
      <rect x="3" y="4" width="18" height="6" rx="3" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'} opacity="0.8"/>
      <rect x="7" y="2" width="2" height="4" rx="1" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="15" y="2" width="2" height="4" rx="1" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="7" y="14" width="2" height="2" rx="0.5" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="11" y="14" width="2" height="2" rx="0.5" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
      <rect x="15" y="14" width="2" height="2" rx="0.5" fill={active ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)'}/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5C4.5 21 3 21 3 19V5C3 3 4.5 3 5 3H9" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 17L21 12L16 7" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function Flower({ size = 24, color = 'var(--mint-soft)', style = {} }) {
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
  { to: '/', label: 'Home', icon: HomeIcon, color: 'var(--theme-pink)', shadow: 'var(--theme-pink-border)', end: true },
  { to: '/cursos', label: 'Cursos', icon: CursosIcon, color: 'var(--theme-mint)', shadow: 'var(--theme-mint-shadow)' },
  { to: '/tareas', label: 'Tareas', icon: TareasIcon, color: 'var(--theme-pink)', shadow: 'var(--theme-pink-border)' },
  { to: '/calendario', label: 'Calendario', icon: CalendarioIcon, color: 'var(--theme-lila)', shadow: 'var(--theme-lila-border)' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
        background: 'var(--theme-sidebar-bg)',
        borderRight: '2px solid var(--theme-sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden', isolation: 'isolate'
      }}>
        {/* Decoraciones sidebar */}
        <Cloud
          size={theme === 'dark' ? 80 : 108}
          color="var(--decor-cloud-light)"
          style={{
            position: 'absolute', bottom: theme === 'dark' ? '15%' : '34%', right: theme === 'dark' ? '-20px' : '12px',
            opacity: theme === 'dark' ? 0.82 : 0.78, zIndex: 0, pointerEvents: 'none',
            filter: theme === 'dark'
              ? 'drop-shadow(0 2px 3px rgba(255, 145, 187, 0.18))'
              : 'drop-shadow(0 2px 4px rgba(255, 145, 187, 0.2))'
          }}
        />
        <Flower
          size={theme === 'dark' ? 24 : 34}
          color="var(--decor-flower-light)"
          style={{
            position: 'absolute', top: theme === 'dark' ? undefined : '68%', bottom: theme === 'dark' ? '28%' : undefined, left: '10px',
            opacity: theme === 'dark' ? 0.88 : 0.78, zIndex: 0, pointerEvents: 'none',
            filter: theme === 'dark'
              ? 'drop-shadow(0 1px 2px rgba(155, 122, 220, 0.16))'
              : 'drop-shadow(0 1px 3px rgba(135, 105, 210, 0.18))'
          }}
        />
        <Star
          size={theme === 'dark' ? 12 : 17}
          color="var(--decor-star-light)"
          style={{
            position: 'absolute', top: theme === 'dark' ? '35%' : '27%', right: theme === 'dark' ? '18px' : '10px',
            opacity: theme === 'dark' ? 0.8 : 0.76, zIndex: 0, pointerEvents: 'none',
            filter: theme === 'dark'
              ? 'drop-shadow(0 1px 2px rgba(155, 122, 220, 0.18))'
              : 'drop-shadow(0 1px 2px rgba(135, 105, 210, 0.18))'
          }}
        />

        {/* Logo */}
        <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
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
                <rect x="10" y="20" width="8" height="2" rx="1" fill="var(--mint-soft)"/>
              </svg>
            </div>
            <h1 style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: '1.4rem',
              color: 'var(--theme-text)',
              lineHeight: 1
            }}>Flora</h1>
          </div>
        </div>

        {/* User info */}
        <div style={{
          background: 'var(--theme-raised)',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '24px',
          border: '2px solid var(--theme-border)', position: 'relative', zIndex: 1
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--theme-lila-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px',
            boxShadow: '0 2px 0px var(--theme-lila-shadow)'
          }}>
            <span style={{ color: 'var(--theme-text-strong)', fontWeight: 800, fontSize: '1rem', fontFamily: "'Nunito', sans-serif" }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--theme-text)', fontFamily: "'Nunito', sans-serif" }}>
            {user?.nombre}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
            {user?.email}
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, position: 'relative', zIndex: 1 }}>
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
                color: isActive ? 'var(--theme-text-strong)' : 'var(--theme-text-secondary)',
                boxShadow: isActive ? `0 3px 0px ${shadow}` : 'none',
                transition: 'all 0.15s',
                border: isActive ? `2px solid ${shadow}` : '2px solid transparent'
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

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '12px', marginBottom: '10px',
            border: '2px solid var(--theme-border)', background: 'var(--theme-raised)',
            cursor: 'pointer', color: 'var(--theme-text-secondary)', width: '100%', position: 'relative', zIndex: 1
          }}
        >
          <ThemeIcon theme={theme} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '12px',
            border: '2px solid var(--theme-border)',
            background: 'transparent', cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem',
            fontWeight: 600, color: 'var(--theme-text-secondary)',
            transition: 'all 0.15s', width: '100%', position: 'relative', zIndex: 1
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--theme-raised)' }}
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
        minHeight: '100vh',
        background: 'var(--theme-page-bg)',
        transition: 'background 0.2s ease, color 0.2s ease'
      }}>
        <Outlet />
      </main>

      {notification && (
        <div style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 2000,
          background: notification.type === 'error' ? 'var(--theme-pink-inner)' : 'var(--theme-raised)',
          border: `2px solid ${notification.type === 'error' ? 'var(--theme-pink-border)' : 'var(--theme-sage-border)'}`,
          boxShadow: `4px 4px 0px ${notification.type === 'error' ? 'var(--theme-pink-shadow)' : 'var(--theme-sage-shadow)'}`,
          color: notification.type === 'error' ? 'var(--theme-pink-accent)' : 'var(--theme-text)',
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

function ThemeIcon({ theme }) {
  return theme === 'dark' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3V5M12 19V21M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M3 12H5M19 12H21M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke="var(--theme-text-secondary)" strokeWidth="2"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4A8.5 8.5 0 1 0 20 15.2Z" stroke="var(--theme-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
