import { Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { ProtectedRoute } from '../../shared/components/ProtectedRoute'
import { useRestaurant } from './hooks/useRestaurants'
import { tableRoutes } from './modules/tables'
import { menuRoutes } from './modules/menus'
import { panelRoutes } from './modules/panel'

function RestaurantModuleLayout() {
  const { id } = useParams<{ id: string }>()
  const { restaurant } = useRestaurant(id!)

  return (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      <header className="flex items-center py-5 border-b border-gray-200 mb-8">
        <Link to={`/restaurants/${id}`} className="text-sm text-gray-500 hover:text-gray-800 transition">
          ←  {restaurant?.name ?? 'Restauracja'}
        </Link>
      </header>
      <Outlet />
    </div>
  )
}

export function RestaurantRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="restaurants/:id">
        <Route index element={<ProtectedRoute><RestaurantDetailPage /></ProtectedRoute>} />
        <Route element={<ProtectedRoute><RestaurantModuleLayout /></ProtectedRoute>}>
          {tableRoutes}
          {menuRoutes}
          {panelRoutes}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
