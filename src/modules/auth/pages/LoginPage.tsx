import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Zaloguj się</h1>
        <p className="text-sm text-gray-500 mb-8">Witaj z powrotem — wpisz swoje dane</p>
        <LoginForm />
      </div>
    </div>
  )
}
