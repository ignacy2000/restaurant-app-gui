import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { Table } from '../types/table.types'

function seats(n: number): string {
  const r10 = n % 10
  const r100 = n % 100
  if (r10 === 1 && r100 !== 11) return `${n} miejsce`
  if (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) return `${n} miejsca`
  return `${n} miejsc`
}

const inputCls =
  'w-24 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-none transition ' +
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

interface Props {
  table: Table
  restaurantId: string
  onUpdateCapacity: (tableId: string, capacity: number) => Promise<void>
  onDelete: (tableId: string) => Promise<void>
}

export function TableCard({ table, restaurantId, onUpdateCapacity, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [capacity, setCapacity] = useState(table.capacity)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<SVGSVGElement>(null)

  const guestUrl = `${window.location.origin}/table/${restaurantId}/${table.id}`

  async function handleSave() {
    if (capacity < 1) return
    setSaving(true)
    setError('')
    try {
      await onUpdateCapacity(table.id, capacity)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zapisu')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Usunąć stolik #${table.number}?`)) return
    setDeleting(true)
    try {
      await onDelete(table.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd usuwania')
      setDeleting(false)
    }
  }

  function handleCancel() {
    setCapacity(table.capacity)
    setEditing(false)
    setError('')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(guestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const svg = qrRef.current
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stolik-${table.number}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col transition hover:shadow-md overflow-hidden">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Stolik</p>
            <p className="text-3xl font-extrabold text-gray-900">#{table.number}</p>
          </div>

          {!editing && (
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => setShowQr(v => !v)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 transition hover:bg-gray-50 cursor-pointer"
              >
                QR
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 transition hover:bg-gray-50 cursor-pointer"
              >
                Edytuj
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs font-medium border border-red-200 rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? '…' : 'Usuń'}
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">Pojemność</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className={inputCls}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {saving ? '…' : 'Zapisz'}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 transition hover:bg-gray-50 cursor-pointer"
              >
                Anuluj
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{seats(table.capacity)}</p>
        )}
      </div>

      {showQr && (
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col items-center gap-3">
          <QRCodeSVG
            ref={qrRef}
            value={guestUrl}
            size={160}
            level="M"
            className="rounded-lg"
          />
          <p className="text-xs text-gray-400 break-all text-center leading-relaxed">{guestUrl}</p>
          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopy}
              className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 transition hover:bg-gray-50 cursor-pointer"
            >
              {copied ? '✓ Skopiowano' : 'Kopiuj link'}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 transition hover:bg-gray-50 cursor-pointer"
            >
              Pobierz SVG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
