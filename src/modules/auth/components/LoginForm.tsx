import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const inputCls =
  'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition ' +
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Adres e-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="jan@example.com"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Hasło
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Logowanie…' : 'Zaloguj się'}
      </button>

      <p className="text-center text-sm text-gray-500 pt-1">
        Nie masz konta?{' '}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </form>
  )
}
