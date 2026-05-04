import { useState, FormEvent } from 'react'
import type { CreateTableReq } from '../types/table.types'

const inputCls =
  'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition ' +
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'

interface Props {
  onSubmit: (data: CreateTableReq) => Promise<void>
  onCancel: () => void
}

export function AddTableForm({ onSubmit, onCancel }: Props) {
  const [number, setNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ number: Number(number), capacity: Number(capacity) })
      setNumber('')
      setCapacity('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania stolika')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold mb-4">Nowy stolik</h3>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="t-number" className="block text-sm font-medium text-gray-700 mb-1.5">
              Numer stolika *
            </label>
            <input
              id="t-number"
              type="number"
              min={1}
              required
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="np. 1"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="t-capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
              Pojemność *
            </label>
            <input
              id="t-capacity"
              type="number"
              min={1}
              required
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="np. 4"
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
            {loading ? 'Dodawanie…' : 'Dodaj stolik'}
          </button>
        </div>
      </form>
    </div>
  )
}
