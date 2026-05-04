import { useParams, Link } from 'react-router-dom'
import { useRestaurant } from '../hooks/useRestaurants'
import { Spinner } from '../../../shared/components/Spinner'

const modules = [
  {
    key: 'tables',
    icon: '🪑',
    label: 'Stoliki',
    description: 'Zarządzaj stolikami i pojemnością sali',
    path: (id: string) => `/restaurants/${id}/tables`,
  },
  {
    key: 'menus',
    icon: '🍽️',
    label: 'Menu',
    description: 'Zarządzaj kartami menu restauracji',
    path: (id: string) => `/restaurants/${id}/menus`,
  },
  {
    key: 'panel',
    icon: '📋',
    label: 'Panel obsługi',
    description: 'Zamówienia i wezwania kelnera na żywo',
    path: (id: string) => `/restaurants/${id}/panel`,
  },
]

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { restaurant, loading, error } = useRestaurant(id!)

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">
      <header className="flex items-center justify-between py-5 border-b border-gray-200 mb-8">
        <span className="text-blue-600 font-bold text-lg tracking-tight">RST Panel</span>
        <Link
          to="/"
          className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          ← Moje restauracje
        </Link>
      </header>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      ) : restaurant ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">{restaurant.name}</h1>
            {restaurant.address && (
              <p className="text-gray-500 mt-1.5">📍 {restaurant.address}</p>
            )}
          </div>

          {restaurant.description && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Opis</h2>
              <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
            </div>
          )}

          <h2 className="text-sm font-semibold text-gray-700 mb-3">Moduły</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(mod =>
              mod.path ? (
                <Link
                  key={mod.key}
                  to={mod.path(id!)}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-2 transition hover:shadow-md hover:border-blue-200 group"
                >
                  <span className="text-2xl">{mod.icon}</span>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">{mod.label}</p>
                  <p className="text-sm text-gray-500">{mod.description}</p>
                </Link>
              ) : (
                <div
                  key={mod.key}
                  className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 flex flex-col gap-2 opacity-60"
                >
                  <span className="text-2xl">{mod.icon}</span>
                  <p className="font-bold text-gray-500">{mod.label}</p>
                  <p className="text-sm text-gray-400">{mod.description}</p>
                </div>
              )
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
