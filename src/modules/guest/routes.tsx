import { Route } from 'react-router-dom'
import { TablePage } from './pages/TablePage'

export const guestRoutes = (
  <Route path="/table/:restaurantId/:tableId" element={<TablePage />} />
)
