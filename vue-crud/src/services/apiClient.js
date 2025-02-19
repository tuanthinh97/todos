import axios from 'axios'

// Tạo Axios instance dùng chung
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 5000, // Timeout 5s
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor thêm token tự động (nếu có)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Thêm token vào headers
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor xử lý lỗi từ API
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  (error) => {
    console.error('API Error:', error.response?.status, error.message)

    // Xử lý khi token hết hạn (401)
    if (error.response?.status === 401) {
      console.warn('Token expired. Redirecting to login...')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error) // Trả lỗi về component để xử lý
  }
)

export default apiClient
