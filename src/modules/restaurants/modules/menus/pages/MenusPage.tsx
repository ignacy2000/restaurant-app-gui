import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMenus } from '../hooks/useMenus'
import { menusApi } from '../services/menus.api'
import { MenuCard } from '../components/MenuCard'
import { AddMenuForm } from '../components/AddMenuForm'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { CreateMenuReq, MenuItem } from '../types/menu.types'

export function MenusPage() {
  const { id } = useParams<{ id: string }>()
  const { menus, loading, error, create } = useMenus(id!)

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!id) return
    menusApi.getItemsByRestaurant(id).then(setMenuItems).catch(() => {})
  }, [id])

  async function handleCreate(data: CreateMenuReq) {
    await create(data)
    setShowForm(false)
  }

  function handleItemCreated(item: MenuItem) {
    setMenuItems(prev => [...prev, item])
  }

  function handleItemDeleted(itemId: string) {
    setMenuItems(prev => prev.filter(i => i.id !== itemId))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Menu</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
          >
            + Dodaj menu
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      ) : (
        <>
          {showForm && (
            <AddMenuForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {menus.length === 0 && !showForm ? (
            <div className="flex flex-col items-center text-center py-16">
              <span className="text-5xl mb-4 opacity-40">🍽️</span>
              <h3 className="text-lg font-bold mb-2">Brak menu</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Dodaj pierwsze menu — możesz mieć kilka kart (np. obiad, kolacja, sezonowe).
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 cursor-pointer"
              >
                + Dodaj pierwsze menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.map(menu => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  items={menuItems.filter(i => i.menu_id === menu.id)}
                  onItemCreated={handleItemCreated}
                  onItemDeleted={handleItemDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
