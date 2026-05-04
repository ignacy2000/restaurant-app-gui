import { Route } from 'react-router-dom'
import { MenusPage } from './pages/MenusPage'
import { ProtectedRoute } from '../../../../shared/components/ProtectedRoute'

export const menuRoutes = (
  <Route
    path="/restaurants/:id/menus"
    element={<ProtectedRoute><MenusPage /></ProtectedRoute>}
  />
)
