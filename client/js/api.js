// API service for interacting with the backend
const API_URL = "http://localhost:5000/api"

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
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

// Payments API
const PaymentsAPI = {
  getAll: () => fetchAPI("/payments"),
  getById: (id) => fetchAPI(`/payments/${id}`),
  getByDateRange: (startDate, endDate) => fetchAPI(`/payments/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (paymentData) =>
    fetchAPI("/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
  update: (id, paymentData) =>
    fetchAPI(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    }),
  delete: (id) =>
    fetchAPI(`/payments/${id}`, {
      method: "DELETE",
    }),
}

// Products API
const ProductsAPI = {
  getAll: () => fetchAPI("/products"),
  getById: (id) => fetchAPI(`/products/${id}`),
  getByDateRange: (startDate, endDate) => fetchAPI(`/products/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (productData) =>
    fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),
  update: (id, productData) =>
    fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),
  delete: (id) =>
    fetchAPI(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Interactions API
const InteractionsAPI = {
  getAll: () => fetchAPI("/interactions"),
  getById: (id) => fetchAPI(`/interactions/${id}`),
  getByDateRange: (startDate, endDate) =>
    fetchAPI(`/interactions/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (interactionData) =>
    fetchAPI("/interactions", {
      method: "POST",
      body: JSON.stringify(interactionData),
    }),
  update: (id, interactionData) =>
    fetchAPI(`/interactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(interactionData),
    }),
  delete: (id) =>
    fetchAPI(`/interactions/${id}`, {
      method: "DELETE",
    }),
}

// Reports API
const ReportsAPI = {
  generate: (reportType, date) => fetchAPI(`/reports?reportType=${reportType}&date=${date}`),
}

// Export all APIs
export { PaymentsAPI, ProductsAPI, InteractionsAPI, ReportsAPI }
