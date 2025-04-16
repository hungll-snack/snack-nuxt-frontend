import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useRuntimeConfig } from 'nuxt/app'

export const createAxiosInstance = (
  token?: string,
  accountId?: string
): AxiosInstance => {
  const config = useRuntimeConfig()

  return axios.create({
    baseURL: config.public.MAIN_API_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`, userToken: token } : {}),
      ...(accountId ? { 'Account-Id': accountId } : {}),
    },
    withCredentials: true,
  })
}