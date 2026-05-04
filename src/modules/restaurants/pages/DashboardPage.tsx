import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRestaurants } from '../hooks/useRestaurants'
import { useAuth } from '../../auth'
import { RestaurantCard } from '../components/RestaurantCard'
import { CreateRestaurantForm } from '../components/CreateRestaurantForm'
import { Spinner } from '../../../shared/components/Spinner'
import type { CreateRestaurantReq } from '../types/restaurant.types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { email, logout } = useAuth()
  const { restaurants, loading, error, create } = useRestaurants()
  const [showForm, setShowForm] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  async function handleCreate(data: CreateRestaurantReq) {
    const created = await create(data)
    setShowForm(false)
    navigate(`/restaurants/${created.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">
      <header className="flex items-center justify-between py-5 border-b border-gray-200 mb-8">
        <span className="text-blue-600 font-bold text-lg tracking-tight">RST Panel</span>
        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
              {email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
          >
            Wyloguj
          </button>
        </div>
      </header>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Moje restauracje</h2>
            {restaurants.length > 0 && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
              >
                + Dodaj nową
              </button>
            )}
          </div>

          {showForm && (
            <CreateRestaurantForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {restaurants.length === 0 && !showForm ? (
            <div className="flex flex-col items-center text-center py-16">
              <span className="text-5xl mb-4 opacity-40">🍽️</span>
              <h3 className="text-lg font-bold mb-2">Nie masz jeszcze żadnej restauracji</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Dodaj swoją pierwszą restaurację, aby zacząć zarządzać menu, stolikami i zamówieniami.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
              >
                + Utwórz pierwszą restaurację
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
