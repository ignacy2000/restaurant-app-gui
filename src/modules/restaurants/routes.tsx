import { Route } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { ProtectedRoute } from '../../shared/components/ProtectedRoute'
import { tableRoutes } from './modules/tables'
import { menuRoutes } from './modules/menus'
import { panelRoutes } from './modules/panel'

export const restaurantRoutes = (
  <>
    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/restaurants/:id" element={<ProtectedRoute><RestaurantDetailPage /></ProtectedRoute>} />
    {tableRoutes}
    {menuRoutes}
    {panelRoutes}
  </>
)
