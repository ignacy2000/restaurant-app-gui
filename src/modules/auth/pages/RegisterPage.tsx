import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Rejestracja</h1>
        <p className="text-sm text-gray-500 mb-8">Utwórz nowe konto</p>
        <RegisterForm />
      </div>
    </div>
  )
}
