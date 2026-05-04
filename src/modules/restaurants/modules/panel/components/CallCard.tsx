import { useState } from 'react'
import type { WaiterCall, CallStatus } from '../../calls/types/call.types'

const STATUS_LABEL: Record<CallStatus, string> = {
  pending: 'Oczekuje',
  acknowledged: 'Przyjęte',
  done: 'Zakończone',
}

const STATUS_COLOR: Record<CallStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  acknowledged: 'bg-blue-100 text-blue-800',
  done: 'bg-gray-100 text-gray-500',
}

const NEXT_STATUS: Partial<Record<CallStatus, CallStatus>> = {
  pending: 'acknowledged',
  acknowledged: 'done',
}

const NEXT_LABEL: Partial<Record<CallStatus, string>> = {
  pending: 'Przyjmij',
  acknowledged: 'Zakończ',
}

interface Props {
  call: WaiterCall
  tableNumber?: number
  onUpdateStatus: (callId: string, status: CallStatus) => Promise<void>
}

export function CallCard({ call, tableNumber, onUpdateStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const nextStatus = NEXT_STATUS[call.status]
  const isDone = call.status === 'done'

  async function handleAction(status: CallStatus) {
    setLoading(true)
    try { await onUpdateStatus(call.id, status) } finally { setLoading(false) }
  }

  const time = new Date(call.created_at).toLocaleTimeString('pl-PL', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 transition ${isDone ? 'opacity-60 border-gray-100' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900">
            {tableNumber != null ? `Stolik #${tableNumber}` : 'Stolik'}
          </p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[call.status]}`}>
          {STATUS_LABEL[call.status]}
        </span>
      </div>

      <p className="text-sm text-gray-600 flex items-center gap-2">
        <span>🔔</span> Prośba o obsługę
      </p>

      {!isDone && nextStatus && (
        <button
          onClick={() => handleAction(nextStatus)}
          disabled={loading}
          className="w-full py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
        >
          {loading ? '…' : NEXT_LABEL[call.status]}
        </button>
      )}
    </div>
  )
}
