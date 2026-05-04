import { useState, FormEvent } from 'react'
import type { CreateRestaurantReq } from '../types/restaurant.types'

const inputCls =
  'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition ' +
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'

interface Props {
  onSubmit: (data: CreateRestaurantReq) => Promise<void>
  onCancel: () => void
}

export function CreateRestaurantForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ name, description, address })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd tworzenia restauracji')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold mb-4">Nowa restauracja</h3>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="r-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nazwa *
          </label>
          <input
            id="r-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. Pizzeria Roma"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="r-address" className="block text-sm font-medium text-gray-700 mb-1.5">
              Adres
            </label>
            <input
              id="r-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="ul. Przykładowa 1"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="r-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
              Opis
            </label>
            <input
              id="r-desc"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Krótki opis"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Tworzenie…' : 'Utwórz restaurację'}
          </button>
        </div>
      </form>
    </div>
  )
}
