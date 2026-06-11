import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Tareas from './pages/Tareas'
import Calendario from './pages/Calendario'
import Layout from './components/Layout'

function RutaProtegida({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<RutaProtegida><Layout /></RutaProtegida>}>
        <Route index element={<Home />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="tareas" element={<Tareas />} />
        <Route path="calendario" element={<Calendario />} />
      </Route>
    </Routes>
  )
}