import { Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { authStorage } from '../../shared/services/auth.storage'

function GuestRoute({ children }: { children: React.ReactNode }) {
  if (authStorage.isAuthenticated()) return <Navigate to="/" replace />
  return <>{children}</>
}

export const authRoutes = (
  <>
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
  </>
)
