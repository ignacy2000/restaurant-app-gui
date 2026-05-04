import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTables } from '../hooks/useTables'
import { useRestaurant } from '../../../hooks/useRestaurants'
import { TableCard } from '../components/TableCard'
import { AddTableForm } from '../components/AddTableForm'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { CreateTableReq } from '../types/table.types'

export function TablesPage() {
  const { id } = useParams<{ id: string }>()
  const { restaurant } = useRestaurant(id!)
  const { tables, loading, error, create, updateCapacity, remove } = useTables(id!)
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(data: CreateTableReq) {
    await create(data)
    setShowForm(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">
      <header className="flex items-center justify-between py-5 border-b border-gray-200 mb-8">
        <div>
          <Link to={`/restaurants/${id}`} className="text-sm text-gray-500 hover:text-gray-800 transition">
            ← {restaurant?.name ?? 'Restauracja'}
          </Link>
          <h1 className="text-xl font-bold mt-0.5">Stoliki</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
          >
            + Dodaj stolik
          </button>
        )}
      </header>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      ) : (
        <>
          {showForm && (
            <AddTableForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {tables.length === 0 && !showForm ? (
            <div className="flex flex-col items-center text-center py-16">
              <span className="text-5xl mb-4 opacity-40">🪑</span>
              <h3 className="text-lg font-bold mb-2">Brak stolików</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Dodaj pierwsze stoliki, aby goście mogli składać zamówienia i wzywać obsługę.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
              >
                + Dodaj pierwszy stolik
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map(table => (
                <TableCard
                  key={table.id}
                  table={table}
                  restaurantId={id!}
                  onUpdateCapacity={(tableId, capacity) =>
                    updateCapacity(tableId, { capacity })
                  }
                  onDelete={remove}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
