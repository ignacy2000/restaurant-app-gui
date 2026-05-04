import { Routes, Route, Navigate } from 'react-router-dom'
import { authRoutes } from '../modules/auth'
import { restaurantRoutes } from '../modules/restaurants'
import { guestRoutes } from '../modules/guest'

export function AppRouter() {
  return (
    <Routes>
      {authRoutes}
      {restaurantRoutes}
      {guestRoutes}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
