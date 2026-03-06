/**
 * lib/api.js — AFYALINK
 *
 * Fixes vs previous version:
 *  1. JWT auto-refresh: on 401, silently POST /auth/refresh/ with the stored
 *     refresh token, update localStorage, retry the original request.
 *     Before: token expired → 401 → token deleted → every request failed silently
 *             → user saw "check your internet connection" until they logged in again.
 *  2. If refresh fails (refresh token also expired), redirect to /login cleanly.
 *  3. Queue concurrent requests that arrive during a refresh instead of firing
 *     multiple refresh calls simultaneously.
 */
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

const api = axios.create({
  baseURL: BASE,
  timeout: 20000,          // Render free tier cold-starts can take 15-20s
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach current access token ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: auto-refresh on 401 ────────────────────────────────
let isRefreshing = false
let waitQueue = []   // requests waiting for the refresh to complete

const processQueue = (error, token = null) => {
  waitQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  waitQueue = []
}

api.interceptors.response.use(
  (response) => response,   // 2xx — pass through

  async (error) => {
    const original = error.config

    // Only attempt refresh on 401, and not on the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retried &&
      !original.url?.includes('auth/refresh/')
    ) {
      original._retried = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        // No refresh token — user must log in again
        _logout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          waitQueue.push({ resolve, reject })
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`
          return api(original)
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post(`${BASE}auth/refresh/`, { refresh: refreshToken })
        const newAccess = res.data.access
        localStorage.setItem('token', newAccess)

        // Update default header and retry all queued requests
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`
        processQueue(null, newAccess)

        // Retry the original request with the new token
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch (refreshError) {
        // Refresh token itself is expired — force logout
        processQueue(refreshError, null)
        _logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function _logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  // Redirect to login without a full page reload losing context
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export default api