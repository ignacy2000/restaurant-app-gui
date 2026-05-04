import { http } from '../../../shared/services/http'
import type { LoginResponse, RegisterResponse } from '../types/auth.types'

export const authApi = {
  login: (email: string, password: string) =>
    http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    http<RegisterResponse>('/users', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (refreshToken: string) =>
    http<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
}
