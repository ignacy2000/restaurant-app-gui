import { Route } from 'react-router-dom'
import { TablesPage } from './pages/TablesPage'
import { ProtectedRoute } from '../../../../shared/components/ProtectedRoute'

export const tableRoutes = (
  <Route
    path="/restaurants/:id/tables"
    element={<ProtectedRoute><TablesPage /></ProtectedRoute>}
  />
)
