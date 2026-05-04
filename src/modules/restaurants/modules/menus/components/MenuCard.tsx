import { useState, FormEvent } from 'react'
import { menusApi } from '../services/menus.api'
import type { Menu, MenuItem, CreateMenuItemReq } from '../types/menu.types'

interface Props {
  menu: Menu
  items: MenuItem[]
  onItemCreated: (item: MenuItem) => void
  onItemDeleted: (itemId: string) => void
}

function formatPrice(price: number) {
  return price.toFixed(2).replace('.', ',') + ' zł'
}

export function MenuCard({ menu, items, onItemCreated, onItemDeleted }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const date = new Date(menu.created_at).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  async function handleAddItem(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      const req: CreateMenuItemReq = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price) || 0,
      }
      const created = await menusApi.createItem(menu.id, req)
      onItemCreated(created)
      setName('')
      setDescription('')
      setPrice('')
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(itemId: string) {
    setDeletingId(itemId)
    try {
      await menusApi.deleteItem(itemId)
      onItemDeleted(itemId)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base">{menu.name}</p>
            {menu.description && (
              <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{menu.description}</p>
            )}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-blue-600 font-medium shrink-0 hover:underline cursor-pointer"
          >
            {expanded ? 'Zwiń' : `Pozycje (${items.length})`}
          </button>
        </div>
        <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">{date}</p>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
          {items.length === 0 && !showForm && (
            <p className="text-sm text-gray-400 text-center py-2">Brak pozycji w tym menu</p>
          )}

          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-blue-600 shrink-0">{formatPrice(item.price)}</span>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="text-gray-300 hover:text-red-500 transition text-lg leading-none disabled:opacity-40 cursor-pointer"
                aria-label="Usuń pozycję"
              >×</button>
            </div>
          ))}

          {showForm ? (
            <form onSubmit={handleAddItem} className="flex flex-col gap-2 pt-1">
              <input
                type="text"
                placeholder="Nazwa dania *"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              />
              <input
                type="text"
                placeholder="Opis (opcjonalnie)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              />
              <input
                type="number"
                placeholder="Cena (zł)"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
                >
                  {saving ? 'Dodawanie…' : 'Dodaj'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  Anuluj
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-blue-600 font-medium hover:underline text-left cursor-pointer"
            >
              + Dodaj pozycję
            </button>
          )}
        </div>
      )}
    </div>
  )
}
