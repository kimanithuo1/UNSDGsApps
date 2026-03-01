import axios from 'axios'

// VITE_API_URL must be set in your Vercel environment variables.
// Value: https://afyalink-backend-k6ld.onrender.com/api/
// (include the trailing slash)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  timeout: 15000, // Render free tier cold-starts can be slow — bumped to 15s
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: if 401, clear stale token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default api