// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for API requests
async function fetchWithAuth(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Reports API
export const ReportsAPI = {
  // Get daily report
  getDailyReport: (date) => fetchWithAuth(`/reports?reportType=daily&date=${date}`),

  // Get weekly report
  getWeeklyReport: (date) => fetchWithAuth(`/reports?reportType=weekly&date=${date}`),

  // Get monthly report
  getMonthlyReport: (date) => fetchWithAuth(`/reports?reportType=monthly&date=${date}`),
}

// Payments API
export const PaymentsAPI = {
  // Get all payments
  getAll: () => fetchWithAuth("/payments"),

  // Get payment by ID
  getById: (id) => fetchWithAuth(`/payments/${id}`),

  // Get payments by date range
  getByDateRange: (startDate, endDate) =>
    fetchWithAuth(`/payments/date-range?startDate=${startDate}&endDate=${endDate}`),

  // Create new payment
  create: (data) =>
    fetchWithAuth("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update payment
  update: (id, data) =>
    fetchWithAuth(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete payment
  delete: (id) =>
    fetchWithAuth(`/payments/${id}`, {
      method: "DELETE",
    }),
}

// Products API
export const ProductsAPI = {
  // Get all products
  getAll: () => fetchWithAuth("/products"),

  // Get product by ID
  getById: (id) => fetchWithAuth(`/products/${id}`),

  // Get products by date range
  getByDateRange: (startDate, endDate) =>
    fetchWithAuth(`/products/date-range?startDate=${startDate}&endDate=${endDate}`),

  // Create new product
  create: (data) =>
    fetchWithAuth("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update product
  update: (id, data) =>
    fetchWithAuth(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete product
  delete: (id) =>
    fetchWithAuth(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Interactions API
export const InteractionsAPI = {
  // Get all interactions
  getAll: () => fetchWithAuth("/interactions"),

  // Get interaction by ID
  getById: (id) => fetchWithAuth(`/interactions/${id}`),

  // Get interactions by date range
  getByDateRange: (startDate, endDate) =>
    fetchWithAuth(`/interactions/date-range?startDate=${startDate}&endDate=${endDate}`),

  // Create new interaction
  create: (data) =>
    fetchWithAuth("/interactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update interaction
  update: (id, data) =>
    fetchWithAuth(`/interactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete interaction
  delete: (id) =>
    fetchWithAuth(`/interactions/${id}`, {
      method: "DELETE",
    }),
}
